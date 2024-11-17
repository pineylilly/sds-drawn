provider "kubernetes" {
    config_path = "~/.kube/config"
}

resource "kubernetes_manifest" "services" {
    for_each = fileset("../k8s/services", "*.yml")

    manifest = yamldecode(file(each.value))
}
