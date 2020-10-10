pipeline {
    agent any

    tools {nodejs "node"}

    environment {
        CHROME_BIN = '/Users/gailphillips/Drivers/chromedriver'
    }

    stages {
        stage('Dependencies') {
            steps {
                sh 'npm i'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Unit Tests') {
            steps {
                sh 'npm run test'
            }
        }
        stage('e2e Tests') {
            steps {
                sh 'npm run cypress:ci'
            }
        }
        
    }
}
