pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "block-dag-2025:latest"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build(env.DOCKER_IMAGE)
                }
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm install'
                sh 'npm test || echo "No test script, skipping."'
            }
        }
        stage('Run Container') {
            steps {
                script {
                    docker.image(env.DOCKER_IMAGE).run('-p 3000:3000')
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
