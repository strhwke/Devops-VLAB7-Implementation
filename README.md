Virtual Lab Experiment 7: Automated Blue-Green Deployment (Jenkins, Kubernetes, Docker, Terraform, Ansible, GitHub)

Overview

This repository scaffolds an end-to-end automated Blue-Green Deployment setup:
- Jenkins builds and deploys a Dockerized app to Kubernetes (blue/green)
- Terraform provisions infra (VPC, Security Group, EC2 for Jenkins)
- Ansible configures Jenkins server with Docker, Maven, kubectl, eksctl
- GitHub hosts source code and triggers CI via webhook

Structure

```
app/                  # Sample Node.js app
k8s/                  # Kubernetes manifests (blue/green deployments, service)
ansible/              # Jenkins provisioning playbook and inventory sample
terraform/            # Infra provisioning for Jenkins EC2, networking, IAM
Jenkinsfile           # CI/CD pipeline implementing blue-green strategy
```

Quick Start

1) Provision Infrastructure (Terraform)
- Install Terraform and configure AWS credentials
```
cd terraform
terraform init
terraform apply -auto-approve
```
- Outputs include the Jenkins public IP.

2) Configure Jenkins (Ansible)
- Update `ansible/inventory.ini` with the EC2 public IP
```
cd ansible
ansible-playbook -i inventory.ini jenkins_setup.yml
```

3) Connect GitHub Webhook
- In your GitHub repo settings, add webhook to `http://<jenkins-ip>:8080/github-webhook/`
- Create Jenkins Multibranch or Pipeline job pointing to your repo and enable GitHub hook trigger

4) Kubernetes
- Update the Docker registry variables and Kubernetes context in Jenkins/global env as needed
- Apply initial manifests if not using the pipeline to do so:
```
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment-blue.yaml
kubectl apply -f k8s/deployment-green.yaml
kubectl apply -f k8s/service.yaml
```

5) Run Pipeline
- Push a commit to trigger the pipeline, which builds image, updates the chosen color deployment, and optionally switches service selector

Test Cases

- TC1: Both blue and green deployments exist and are Ready
  - `kubectl get deploy -l app=myapp -o wide`
- TC2: Service points to correct color
  - `kubectl get svc myapp-service -o jsonpath='{.spec.selector}'`
- TC3: Roll back by switching service to the other color
  - `kubectl patch service myapp-service --type=merge -p '{"spec":{"selector":{"app":"myapp","color":"blue"}}}'`
- TC4: Pipeline triggers on Git push and completes successfully
- TC5: `kubectl rollout status deployment/myapp-green` (or blue) succeeds

Notes

- Replace placeholders like Docker Hub username, AWS region, and EKS cluster names for your environment.
- The Jenkinsfile assumes Linux agents with Docker and kubectl available (provided via Ansible on the Jenkins EC2 host).




