pipeline {
    agent any
    
    environment {
        REGISTRY_HOST = "localhost:5000"
        REGISTRY_K8S = "my-registry:5000"
        IMAGE_NAME = "nestjs-app"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        // stage('Test') {
        //     steps {dir('backend') {
        //         sh "docker build --target builder -t temp-test ."
        //         sh "docker run --rm temp-test npm run test"
        //     }
        // }
        // }
        
        stage('Build & Push Image') {
            steps {
                dir('backend') {
                    sh "docker build -t ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER} ."
                    sh "docker tag ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER} ${REGISTRY_HOST}/${IMAGE_NAME}:latest"
                    sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:latest"
            }
            }
        }
        
        stage('Deploy to K8s') {
            steps {
                withCredentials([file(credentialsId: 'k3d-kubeconfig', variable: 'KUBECONFIG')]) {
                    sh "kubectl --kubeconfig=$KUBECONFIG apply -f k8s/"
                    sh "kubectl --kubeconfig=$KUBECONFIG set image deployment/${IMAGE_NAME} nestjs-container=${REGISTRY_K8S}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "kubectl --kubeconfig=$KUBECONFIG rollout status deployment/${IMAGE_NAME} --timeout=90s"
                }
            }
        }
        
        stage('Smoke Test') {
            steps {
                withCredentials([file(credentialsId: 'k3d-kubeconfig', variable: 'KUBECONFIG')]) {
                    sh '''
                    kubectl --kubeconfig=$KUBECONFIG port-forward svc/nestjs-service 3000:80 &
                    PF_PID=$!
                    sleep 5
                    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
                    kill $PF_PID
                    if [ "$HTTP_STATUS" != "200" ]; then
                        echo "❌ Smoke test failed! Status: $HTTP_STATUS"
                        exit 1
                    fi
                    echo "✅ Smoke test passed!"
                    '''
                }
            }
        }
    }
    
    post {
        failure {
            echo "⚠️ Pipeline failed! Initiating automatic Rollback..."
            withCredentials([file(credentialsId: 'k3d-kubeconfig', variable: 'KUBECONFIG')]) {
                sh 'kubectl --kubeconfig=$KUBECONFIG rollout undo deployment/${IMAGE_NAME}'
                sh 'kubectl --kubeconfig=$KUBECONFIG rollout status deployment/${IMAGE_NAME}'
            }
            echo "⏪ Rollback complete. System restored."
        }
    }
}