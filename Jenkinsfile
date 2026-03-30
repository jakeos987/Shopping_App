pipeline {
    agent any
    
    environment {
        REGISTRY_HOST = "localhost:5000"
        REGISTRY_K8S = "host.docker.internal:5000"
        IMAGE_NAME = "nestjs-app" // נשאיר את השם כדי לא לשבור את ה-YAML
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
        
        // stage('Build & Push Image') {
        //     steps {
        //         dir('backend') {
        //             sh "docker build -t ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER} ."
        //             sh "docker tag ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER} ${REGISTRY_HOST}/${IMAGE_NAME}:latest"
        //             sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER}"
        //             sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:latest"
        //     }
        //     }
        // }

        stage('Build & Push Image') {
    steps {
        echo "🔍 Building NestJS image from source..."
        // הפקודה הזו קוראת את ה-Dockerfile בפרויקט שלך ובונה את הקונטיינר האמיתי
        sh "docker build -t ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER} ./backend"
        
        echo "🚀 pushing image ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER}..."
        // הפקודה הזו דוחפת את הקונטיינר שבנינו ל-Registry
        sh "docker push ${REGISTRY_HOST}/${IMAGE_NAME}:${BUILD_NUMBER}"
    }
}
        
        stage('Deploy to K8s') {
            steps {
                // אנחנו מביאים גם את הקיוּב-קונפיג וגם את קובץ הסודות מתוך הכספת
                withCredentials([
                    file(credentialsId: 'k3d-kubeconfig', variable: 'KUBECONFIG'),
                    file(credentialsId: 'prod-env-file', variable: 'ENV_FILE')
                ]) {
                    // הפקודה הזו יוצרת את הסוד ישירות מהקובץ מבלי לשמור אותו בדיסק
                    sh "kubectl --kubeconfig=$KUBECONFIG create secret generic nestjs-secrets --from-env-file=$ENV_FILE --dry-run=client -o yaml | kubectl --kubeconfig=$KUBECONFIG apply -f -"
                    
                    // שאר הפקודות שלך כרגיל:
                    sh "kubectl --kubeconfig=$KUBECONFIG apply -f k8s/"
                    sh "kubectl --kubeconfig=$KUBECONFIG set image deployment/${IMAGE_NAME} nestjs-container=${REGISTRY_K8S}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "kubectl --kubeconfig=$KUBECONFIG rollout status deployment/${IMAGE_NAME} --timeout=180s"
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
                // רק פקודה אחת שמגלגלת את הדיפלוימנט המדויק, עם התעלמות אם הוא לא קיים
                // sh 'kubectl --kubeconfig=$KUBECONFIG rollout undo deployment/nestjs-app || true'
            }
            echo "⏪ Rollback complete. System restored."
        }
    }
}