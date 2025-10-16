pipeline {
  agent any
  environment {
    DOCKERHUB_USER = credentials('dockerhub-user')
    IMAGE = "archisman04/myapp:${BUILD_NUMBER}"
    COLOR = "green" // can be parameterized
    KUBE_NAMESPACE = "myapp"
    KUBE_DEPLOY_PREFIX = "myapp-"
    APP_NAME = "myapp"
  }
  options {
    timestamps()
  }
  stages {
    stage('Clone Repo') {
      steps {
        checkout scm
      }
    }
    stage('Build Docker Image') {
      steps {
        dir('app') {
          sh "docker build -t ${IMAGE} ."
        }
      }
    }
    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-user', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
          sh 'docker push ${IMAGE}'
        }
      }
    }
    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl -n ${KUBE_NAMESPACE} set image deployment/${KUBE_DEPLOY_PREFIX}${COLOR} ${APP_NAME}=${IMAGE} --record'
        sh 'kubectl -n ${KUBE_NAMESPACE} rollout status deployment/${KUBE_DEPLOY_PREFIX}${COLOR}'
      }
    }
    stage('Switch Service') {
      steps {
        input message: "Switch traffic to ${COLOR} version?", ok: 'Proceed'
        sh 'kubectl -n ${KUBE_NAMESPACE} patch service ${APP_NAME}-service -p "{\"spec\":{\"selector\":{\"app\":\"${APP_NAME}\",\"color\":\"${COLOR}\"}}}"'
      }
    }
  }
}




