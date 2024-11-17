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
