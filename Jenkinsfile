// E-Commerce Automation - CI/CD Pipeline
// Triggers on GitHub Push Events
// Jenkins runs on port 8085

pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        DOCKER_IMAGE_NAME = "ecommerce-app"
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_IMAGE_LATEST = "latest"
        BUILD_TIMESTAMP = "${BUILD_TIMESTAMP}"
    }

    triggers {
        // GitHub webhook trigger
        githubPush()
    }

    stages {
        stage('🔔 Notification') {
            steps {
                script {
                    echo '========================================='
                    echo '   E-Commerce App CI/CD Pipeline Started'
                    echo '========================================='
                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Triggered by: GitHub Push"
                    echo "Branch: ${GIT_BRANCH}"
                    echo "Commit: ${GIT_COMMIT}"
                    echo '========================================='
                }
            }
        }

        stage('📥 Checkout') {
            steps {
                script {
                    echo '>>> Checking out code from GitHub...'
                    checkout scm
                }
            }
        }

        stage('🔨 Build') {
            steps {
                script {
                    echo '>>> Building Spring Boot Application...'
                    dir('Backend') {
                        bat 'mvn clean package -DskipTests'
                    }
                }
            }
        }

        stage('🧪 Test') {
            steps {
                script {
                    echo '>>> Running Unit Tests...'
                    dir('Backend') {
                        bat 'mvn test'
                    }
                }
            }
        }

        stage('🐳 Build Docker Image') {
            steps {
                script {
                    echo ">>> Building Docker Image: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    dir('Backend') {
                        bat "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                        bat "docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_LATEST}"
                    }
                }
            }
        }

        stage('⬆️ Push to Registry (Main Only)') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo ">>> Pushing to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat '''
                            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                            docker tag %DOCKER_IMAGE_NAME%:%DOCKER_IMAGE_LATEST% %DOCKER_USER%/%DOCKER_IMAGE_NAME%:%DOCKER_IMAGE_TAG%
                            docker tag %DOCKER_IMAGE_NAME%:%DOCKER_IMAGE_LATEST% %DOCKER_USER%/%DOCKER_IMAGE_NAME%:%DOCKER_IMAGE_LATEST%
                            docker push %DOCKER_USER%/%DOCKER_IMAGE_NAME%:%DOCKER_IMAGE_TAG%
                            docker push %DOCKER_USER%/%DOCKER_IMAGE_NAME%:%DOCKER_IMAGE_LATEST%
                            docker logout
                        '''
                    }
                }
            }
        }

        stage('🚀 Deploy with Docker Compose') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo '>>> Deploying with Docker Compose...'
                    bat '''
                        docker-compose down
                        docker-compose up -d
                    '''
                }
            }
        }

        stage('✅ Health Check') {
            steps {
                script {
                    echo '>>> Waiting for app to start...'
                    bat '''
                        timeout /t 15 /nobreak
                        echo Checking app health...
                        curl -f http://localhost:8080 && echo ✅ App is running! || (echo ❌ App health check failed! && exit /b 1)
                    '''
                }
            }
        }

        stage('📊 Show Logs') {
            steps {
                script {
                    echo '>>> Application Logs:'
                    bat 'docker-compose logs app'
                }
            }
        }
    }

    post {
        success {
            script {
                echo ''
                echo '╔════════════════════════════════════════╗'
                echo '║  ✅ DEPLOYMENT SUCCESSFUL ✅            ║'
                echo '╚════════════════════════════════════════╝'
                echo ''
                echo 'App available at: http://localhost:8080'
                echo 'Build #: ${BUILD_NUMBER}'
            }
        }
        failure {
            script {
                echo ''
                echo '╔════════════════════════════════════════╗'
                echo '║  ❌ DEPLOYMENT FAILED ❌               ║'
                echo '╚════════════════════════════════════════╝'
                echo ''
                bat 'docker-compose logs app'
            }
        }
        always {
            script {
                echo '========================================='
                echo '        Pipeline Execution Completed     '
                echo '========================================='
            }
        }
    }
}
