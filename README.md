# High Availability Kubernetes Cluster with Deploying

This repository shows how to set up Kubernetes cluster using Ubuntu VMs and Raspberry Pi, and how to deploy application named "Drawn", an application for collaborative drawing.

This cluster contains:
- 3 master nodes, using Ubuntu VMs
- 5 worker nodes, using Raspberry Pi

For bonus, the following are performed:
- **Discord Notification for Node Status**: The notification will be sent to discord when status of any nodes is changed.
- **High Availability Cluster**: 3 master nodes are connected in the cluster, so that 1 master node can down at a time.

## Creating Ubuntu VMs

We will use Ubuntu VMs as master nodes of the cluster.

- Download Ubuntu VM ISO image from https://ubuntu.com/download/desktop.
- Create 3 VMs of Ubuntu (using Oracle VirtualBox), each VM must be on different laptop.
- For each VM, set networking mode to bridged adapter.

## Setting Up Kubernetes Cluster

### Configurating Master Nodes (VMs)

For each master node (VM), performs the following steps:

- Change host name of VM, in this cluster, we will use master nodes host names as "sds-k3s-master", "sds-k3s-master-2", and "sds-k3s-master-3".

  - Access the `/etc/hostname`.
 
    ```
    sudo nano /etc/hostname
    ```

  - Change hostname in the file.
  - Access the `/etc/hosts`.
 
    ```
    sudo nano /etc/hostname
    ```

  - Look for the hostname which must be changed and replace it with new hostname.

- Disable swap because of how Kubernetes manages resources.

  ```
  sudo swapoff -a
  ```

- Reboot the VM to apply changes.

  ```
  sudo reboot
  ```

### Configurating Worker Nodes (Raspberry Pi)

For each worker node (Raspberry Pi), performs the following steps:

- Change host name of Raspberry Pi, in this cluster, we will use worker nodes host names as "workernode1", "workernode2", "workernode3", "workernode4", and "workernode5".

  - Access the `/etc/hostname`.
 
    ```
    sudo nano /etc/hostname
    ```

  - Change hostname in the file.
  - Access the `/etc/hosts`.
 
    ```
    sudo nano /etc/hostname
    ```

  - Look for the hostname which must be changed and replace it with new hostname.

- Disable swap because of how Kubernetes manages resources. Also we want to pernamently disable swap, so we will set the `CONF_SWAPSIZE` to zero.

  ```
  # Disable swap
  sudo swapoff -a
  
  # To turn of swap permanently we need to update the `CONF_SWAPSIZE` in `dphys-swapfile` file to `0`
  sudo nano /etc/dphys-swapfile
  
  # In the file, set the following configuration
  CONF_SWAPSIZE=0
  ```

- Set up cgroup of Raspberry Pi.

  ```
  sudo nano /boot/cmdline.txt
  
  # Add below into THE END of the current line
  cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory
  ```

- Reboot the Raspberry Pi to apply the changes.

  ```
  sudo reboot
  ```

### Connecting to Router and Setting Up Router

- Plug in router and connect all master and worker nodes to router.
  - Connect master nodes to router via Wi-Fi (connect laptops to router's Wi-Fi).
  - Connect worker nodes to router via Ethernet cable.
- Enter [http://192.168.0.1](http://192.168.0.1/) to config the router, the laptop used to config the router must connect to router's Wi-Fi. The default credential of the router is username `admin` password `admin`.
- Go to "Operation Mode" tab, then select "WISP", then save.

  ![image](https://github.com/user-attachments/assets/c701c597-525a-4802-b6c1-be8d33aa1d6b)

- Connect router to external Wi-Fi (Because the nodes require to download K3s, pull images from Docker Hub, and connect to cloud database). Go to "Wireless" >> "Basic Settings", then click "Scan" button to scan for wireless. After selecting SSID, fill wireless password in "Wireless Password" input.

  ![image](https://github.com/user-attachments/assets/7ecd1560-8beb-4d21-bcce-eaf961090941)

- Set static IPs to master and worker nodes by going to "DHCP" >> "Address Reservation" tab. In this cluster, we set the static IPs to each node as follow:
  - For master nodes, set IPs as `192.168.0.170`, `192.168.0.180`, and `192.168.0.190`.
  - For worker nodes, set IPs as `192.168.0.171`, `192.168.0.172`, `192.168.0.173`, `192.168.0.174`, and `192.168.0.175`.

  ![image](https://github.com/user-attachments/assets/0042cd45-42be-4773-9bdb-4cc1da633689)

- Reboot the router to apply static IPs to all nodes.

### Setting Up Kubernetes

For this cluster, [K3s](https://docs.k3s.io/) will be used, which is lightweight Kubernetes.

- For the **FIRST master node**, download K3s and set up the server.

  ```bash
  curl -sfL https://get.k3s.io | sh -s - server --disable traefik --flannel-backend host-gw --tls-san <FIRST_MASTER_NODE_IP> --bind-address <FIRST_MASTER_NODE_IP> --advertise-address <FIRST_MASTER_NODE_IP> --node-ip <FIRST_MASTER_NODE_IP> --cluster-init --write-kubeconfig-mode 644 --kube-controller-manager-arg "node-monitor-grace-period=16s" --kube-controller-manager-arg "node-monitor-period=4s" --kube-apiserver-arg "default-not-ready-toleration-seconds=20" --kube-apiserver-arg "default-unreachable-toleration-seconds=20" --kubelet-arg "node-status-update-frequency=4s"
  ```

  Replace `<FIRST_MASTER_NODE_IP>` with first master node IP. For this cluster, it is `192.168.0.170`.

- In the FIRST master node, get the node token from `/var/lib/rancher/k3s/server/node-token` to use for joining other nodes.

  ```
  sudo cat /var/lib/rancher/k3s/server/node-token
  ```

- For the **REMAINING master nodes**, join to the first master node to make HA cluster (High Availability Cluster).

  ```bash
  curl -sfL https://get.k3s.io | K3S_TOKEN=<K3S_TOKEN> sh -s - server --disable=traefik --flannel-backend=host- gw --write-kubeconfig-mode=644 --server <FIRST_MASTER_NODE_SERVER> --tls-san=<MY_NODE_IP> --kube-controller-manager-arg "node-monitor-grace-period=16s" --kube-controller-manager-arg "node-monitor-period=4s" --kube-apiserver-arg "default-not-ready-toleration-seconds=20" --kube-apiserver-arg "default-unreachable-toleration-seconds=20" --kubelet-arg "node-status-update-frequency=4s"
  ```

  Replace the following parameters
  
  `<K3S_TOKEN>`: The token received from previous step
  
  `<FIRST_MASTER_NODE_SERVER>`: The server URI to first master node (for this cluster, it is `https://192.168.0.170:6443`)

  `<MY_NODE_IP>`: The IP of current master node (for this cluster, it is `192.168.0.180` and `192.168.0.190`)

- For **each worker node**, downnload K3s and join the cluster.

  ```bash
  curl -sfL https://get.k3s.io | K3S_URL=<FIRST_MASTER_NODE_SERVER> K3S_TOKEN=<K3S_TOKEN> sh -
  ```

  Replace the following parameters

  `<FIRST_MASTER_NODE_SERVER>`: The server URI to first master node (for this cluster, it is `https://192.168.0.170:6443`) (or you can use server URI of any master node)
  
  `<K3S_TOKEN>`: The token received from previous step

The cluster should look fine now (you can verify by running `kubectl get nodes`). By the way, the pods in the cluster cannot connect to external domain. To fix this, we will configure the DNS resolution of the cluster.

- Editing the CoreDNS configuration.

  ```
  kubectl -n kube-system edit configmap/coredns
  ```

- Add the external DNS IP at the `forward` params in `Corefile`. (For this cluster, we will add `8.8.8.8` and `8.8.4.4`)

  ```yaml
  ...
  data:
  Corefile: |
    .:53 {
        ...
        forward . /etc/resolv.conf 8.8.8.8 8.8.4.4
        ...
    }
  ```
- Restart the CoreDNS pod to apply the change.

  ```
  kubectl -n kube-system rollout restart deployment/coredns
  ```

- We don't want to let the K8s scheduler to schedule any pod to master node, so we will taint the master node with `NoSchedule`. Set the taint for every master node as follow.
  
  ```bash
  kubectl taint nodes <MASTER_NODE_NAME> node-role.kubernetes.io/master=:NoSchedule
  ```

### Setting Up Discord Notification

The notification will be shown when the server is initialized or the status of the nodes are changed.

- Download discord notification binary file in the repository at `k3s-discord-notification-nodes directory`. Because our master nodes use Ubuntu VMs, the binary file should be `server-linux-x64-baseline`. (You can navigate in the repository or click this [link](https://github.com/pineylilly/sds-final-project/tree/main/k3s-discord-notification-nodes)). You can download in laptop and copy to master node using SFTP or use wget to download to master nodes directly.
```
wget https://github.com/pineylilly/sds-final-project/raw/refs/heads/main/k3s-discord-notification-nodes/server-linux-x64-baseline
```

- Open Discord and go to settings of the server you want to send notification. Then select "Integrations" tab and select "Webhook".

  ![image](https://github.com/user-attachments/assets/aaa0bcce-7b61-4365-a768-ae02623d172c)

- Create webhook by clicking "New Webhook" button, then change the name of the webhook and choose the channel which you want to let notification sent to. Copy the Webhook URL by clicking "Copy Webhook URL" (we will use this URL later).

  ![image](https://github.com/user-attachments/assets/0bccee5a-b00d-416b-8caa-49d1ab77458b)

- In every master node, create the cron job so that the notification binary file can start running after booting.
  - Access the crontab
    
    ```
    crontab -e
    ```

  - Adding a line for running the script after booting.

    ```bash
    @reboot DISCORD_WEBHOOK_URL=<DISCORD_WEBHOOK_URL> MY_NODE=<MY_NODE_NAME> <PATH_TO_NOTIFICATION_BINARY_FILE>
    ```

    Replace the following parameters
    
    `<DISCORD_WEBHOOK_URL>`: The webhook URL which is copied from the UI where the Discord webhook is created.

    `<MY_NODE_NAME>`: The name of the current master node (which is `sds-k3s-master`, `sds-k3s-master-2`, or `sds-k3s-master-3`)

    `<PATH_TO_NOTIFICATION_BINARY_FILE>`: The path of the binary file of the notification sender downloaded in the step above. (For example, `/home/vboxuser/server-linux-x64-baseline`)

- Reboot all master nodes one by one to start notification sender.
  
  ```
  sudo reboot
  ```

- Now you will see notification shown in Discord.

  ![image](https://github.com/user-attachments/assets/321a59b7-5b02-41d2-9fd0-acc88a92e533)

## Set Up Firebase Storage

Because our application require Firebase Storage to store images, we need to create project in Firebase and get key for accessing Firebase Storage.

- Create a project in [Firebase](https://firebase.google.com/), then open project settings.

  ![image](https://github.com/user-attachments/assets/32b6bd6e-422f-476a-b900-8d667589017d)

- Go to "SDK Setup and Configuration" and copy configuaration, we will use this in deploying application step.

  ![image](https://github.com/user-attachments/assets/9854456a-fc11-4f8a-a988-c37ed240afcf)

- Go to "Storage" tab at the left side of the page, you will see storage of your project.

  ![image](https://github.com/user-attachments/assets/ebd4d444-6d7e-43e6-bbc9-269104da3ed2)

- Go to "Rule" tab at the top of page, set the configuration so that everyone can read or write files in storage.

  ![image](https://github.com/user-attachments/assets/3d0b3d85-9e41-4c8a-8baf-3efe4502d01f)

## Deploying an Application

The application we will deploy named "Drawn", which is application for collaborative drawing. It consists of frontend, API gateway, 4 backend services, Redis, and ingress.

- Download Kubernetes YAML files from `k8s` directory in this repository (you can click this [link](https://github.com/pineylilly/sds-final-project/tree/main/k8s)). Copy this directory to master nodes via SFTP.

- For the environment variables for each container, open the YAML files and set the environment variables as follow:
  - User Management Service (`/k8s/services/user-management-service.yml`)
    - `DATABASE_URL`: The connection string of PostgreSQL database (cloud database), you may create database in [Supabase](https://supabase.com/).
    - `JWT_SECRET`: The secret of JWT, you can set the new random secret.
    - `JWT_KEY`: The key of JWT, you can set the new random key.
    - `FIREBASE_API_KEY`: API key from Firebase configuration.
    - `FIREBASE_AUTH_DOMAIN` Authentication domain from Firebase configuration.
    - `FIREBASE_PROJECT_ID` Project ID from Firebase configuration.
    - `FIREBASE_STORAGE_BUCKET` Storage bucket from Firebase configuration.
    - `FIREBASE_MESSAGING_SENDER_ID` Messaging sender ID from Firebase configuration.
    - `FIREBASE_APP_ID` Application ID from Firebase configuration.
  - Workspace Management Service (`/k8s/services/workspace-management-service.yml`)
    - `DATABASE_URL`: The connection string of PostgreSQL database (cloud database), which is different from user management service database, you may create database in [Supabase](https://supabase.com/) or use the same database, but choose different schema.
  - Collaboration Service (`/k8s/services/collaboration-service.yml`)
    - `DATABASE_URL`: The connection string of MongoDB database (cloud database), you may create database in [MongDB Atlas](https://www.mongodb.com/products/platform/atlas-database).
    - `FIREBASE_API_KEY`: API key from Firebase configuration.
    - `FIREBASE_AUTH_DOMAIN` Authentication domain from Firebase configuration.
    - `FIREBASE_PROJECT_ID` Project ID from Firebase configuration.
    - `FIREBASE_STORAGE_BUCKET` Storage bucket from Firebase configuration.
    - `FIREBASE_MESSAGING_SENDER_ID` Messaging sender ID from Firebase configuration.
    - `FIREBASE_APP_ID` Application ID from Firebase configuration.
  - Chat Service (`/k8s/services/chat-service.yml`)
    - `DATABASE_URL`: The connection string of MongoDB database (cloud database), you may create database in [MongDB Atlas](https://www.mongodb.com/products/platform/atlas-database).
  
- Create NGINX Ingress Controller by applying the YAML file.
  
  ```
  cd ingress
  kubectl apply -f nginx-ingress-controller.yml
  ```

- Create ingress by applying ingress YAML file.
  
  ```
  kubectl apply -f ingress.yml
  ```

- Create all services include frontend, API gateway, Redis, and 4 backend services.
  
  ```
  cd ../services
  kubectl apply -f .
  ```

  __Warning: If your internet speed is slow. It may use very long time to create pods and services or you will get error on pulling images from Docker Hub. If this happen, you may create the services one by one.__
  
- You can check if your deployment work well by viewing all pods and services.

  ```
  kubectl get pods
  ```

- If your deployment work well, you can access the application by visiting http://localhost in any master node that is in the cluster.
