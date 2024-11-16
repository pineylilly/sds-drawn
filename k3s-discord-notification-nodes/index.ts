import { $ } from "bun";
import type { Node } from "./types/node";

// Wait for n seconds
async function sleep(n: number) {
    return new Promise(resolve => setTimeout(resolve, n * 1000))
}

// Get nodes from kubectl
async function getNodes(): Promise<Node[] | null> {
    try {
        const nodes = await $`kubectl get nodes`
        if (nodes.exitCode !== 0) {
            console.error('Error fetching nodes')
            return null
        }
        return nodes.text().trim().split('\n').slice(1).map(node => {
            const [name, status, role, age, version] = node.trim().split(/\s+/)
            return { name, status, role, age, version }
        })
    } catch (err) {
        console.error(err)
        return null
    }
}

// Data to embed in discord message
function getEmbedData(title: string, description: string) {
    return {
        embeds: [
            {
                title: title,
                description: description,
                timestamp: new Date().toISOString(),
                author: {
                    "name": "Kubernetes Notification (SDS Final Project)",
                    "icon_url": "https://firebasestorage.googleapis.com/v0/b/drawn-2368b.appspot.com/o/avatars%2F1731472452856-IMG_3565.JPG?alt=media&token=9d7a9cf8-4407-41db-b032-d5cecf15c21b"
                },
                color: 10181046
            }
        ]
    }
}

// Nodes status to text
async function getNodesText(nodes: Node[]): Promise<string> {
    if (nodes) {
        return nodes.map(node => `${(node.status === "Ready") ? "🟢" : "🔴"}${" "}**${node.name}** [${node.status}]\n${"　　"}Roles: ${node.role}`).join('\n')
    } else {
        return 'Error fetching nodes'
    }
}

// Send initial message to discord
async function sendInitialMessage(nodes: Node[]) {
    try {
        const response = await fetch(process.env.DISCORD_WEBHOOK_URL || "", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(getEmbedData('Current Nodes Status', await getNodesText(nodes))),
        })
    } catch (err) {
        console.error(err)
    }
}

// Send message to discord
async function sendMessage(title: string, description: string) {
    try {
        const response = await fetch(process.env.DISCORD_WEBHOOK_URL || "", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(getEmbedData(title, description)),
        })
    } catch (err) {
        console.error(err)
    }
}

// Get difference between old and new nodes
function getDifference(oldNodes: Node[], newNodes: Node[]): Node[] {
    
    return newNodes.filter(newNode => {
        return !oldNodes.some(oldNode => oldNode.name === newNode.name && oldNode.status === newNode.status)
    })
}

// Check if my node must send message
function isMyNodeTurn(nodes: Node[]) {
    const masterNodes = nodes.filter(node => node.role.includes('master'))
    // Get index of my node
    const myNodeIndex = masterNodes.findIndex(node => node.name === process.env.MY_NODE)
    if (myNodeIndex === -1) {
        console.error('My node not found')
        return false
    }
    // Get my node
    const myNodeStatus = masterNodes[myNodeIndex].status
    // Check if all nodes before my node are not ready and my ndoe is ready
    return masterNodes.slice(0, myNodeIndex).every(node => node.status !== 'Ready') && myNodeStatus === 'Ready'
}

// Start the process
async function startProcess() {
    console.log('Starting process...')
    var nodes: Node[] | null = await getNodes()
    while (!nodes) {
        if (!nodes)
            console.error('Error fetching nodes')
        await sleep(5)
        nodes = await getNodes()
    }

    if (isMyNodeTurn(nodes)) {
        await sendInitialMessage(nodes)
    }

    while (true) {
        await sleep(5)
        const newNodes = await getNodes()
        if (!newNodes) {
            console.error('Error fetching nodes')
            continue
        }

        const difference = getDifference(nodes, newNodes)
        console.log('Difference:', difference)
        if (difference.length > 0) {
            try {
                const title = 'Node Status Changed'
                const description = difference.map(node => `${node.name}\n${"　　"}${nodes?.filter(n => n.name === node.name)[0].status} => ${node.status}`).join('\n') + '\n**Current Nodes Status:**\n' + await getNodesText(newNodes)
                if (isMyNodeTurn(newNodes)) {
                    await sendMessage(title, description)
                }
            } catch (err) {
                console.error(err)
            }
        }
        nodes = newNodes
    }
}

if (!process.env.DISCORD_WEBHOOK_URL) {
    console.error('DISCORD_WEBHOOK_URL not found')
    process.exit(1)
}

if (!process.env.MY_NODE) {
    console.error('MY_NODE not found')
    process.exit(1)
}

await startProcess()