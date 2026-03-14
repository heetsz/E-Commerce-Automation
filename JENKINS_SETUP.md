# Jenkins CI/CD Pipeline Setup Guide

**Jenkins runs on:** `http://localhost:8085`

---

## ✅ Prerequisites

- Jenkins installed and running on port 8085
- Docker and Docker Compose installed
- Git installed
- Maven installed
- Docker Hub account (optional, for pushing images)

---

## 🔧 Step 1: Install Required Jenkins Plugins

1. Go to: **http://localhost:8085/pluginManager**
2. Search and install (if not already installed):
   - ✅ **GitHub Integration Plugin**
   - ✅ **GitHub API Plugin**
   - ✅ **Pipeline** (or Blue Ocean)
   - ✅ **Docker Plugin** (optional)
   - ✅ **Credentials Binding Plugin**
   - ✅ **Git Plugin**

---

## 🔑 Step 2: Add Docker Hub Credentials

1. Go to: **http://localhost:8085/credentials/store/system/domain/_**
2. Click **+ Add Credentials**
3. Fill in:
   - **Kind**: Username with password
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub personal access token
   - **ID**: `docker-hub-credentials`
   - **Description**: Docker Hub Login

4. Click **Create**

---

## 🚀 Step 3: Create Jenkins Pipeline Job

1. Go to **http://localhost:8085** → **+ New Item**
2. Enter **Item name**: `ecommerce-automation`
3. Select **Pipeline** → Click **OK**

### Configure the Job:

#### A. General Section:
- ✅ Check: **GitHub project**
  - **Project URL**: `https://github.com/YOUR_USERNAME/E-Commerce-Automation/`

#### B. Pipeline Section:
- **Definition**: Select **Pipeline script from SCM**
- **SCM**: Select **Git**
- **Repository URL**: `https://github.com/YOUR_USERNAME/E-Commerce-Automation.git`
- **Credentials**: Select your GitHub credentials (or None if public repo)
- **Branch Specifier**: `*/main`
- **Script Path**: `Jenkinsfile`

#### C. Build Triggers Section:
✅ Check: **GitHub hook trigger for GITScm polling**

4. Click **Save**

---

## 🔗 Step 4: Configure GitHub Webhook

### On GitHub:

1. Go to your repository: **Settings** → **Webhooks**
2. Click **Add webhook**
3. Fill in:
   - **Payload URL**: `http://YOUR_JENKINS_IP:8085/github-webhook/`
     - Example: `http://192.168.1.100:8085/github-webhook/`
     - For localhost use: `http://localhost:8085/github-webhook/` (only if GitHub can reach your machine)
   - **Content type**: `application/json`
   - **Events**: Select only "Push events"
   - ✅ Check: **Active**

4. Click **Add webhook**

---

## 🧪 Step 5: Test the Setup

### Option A: Manual Test
1. Go to Jenkins: **ecommerce-automation** → **Build Now**
2. Watch the build in real-time: Click the build number → **Console Output**

### Option B: Automatic Test (GitHub Push)
1. Make a small change to your Git repository
2. Push to the `main` branch:
   ```bash
   git add .
   git commit -m "Test Jenkins webhook"
   git push origin main
   ```
3. Jenkins will automatically trigger!

---

## 📊 What the Pipeline Does:

When triggered (either manually or by GitHub push):

1. **📥 Checkout** - Gets latest code from GitHub
2. **🔨 Build** - Compiles Spring Boot app with Maven
3. **🧪 Test** - Runs unit tests
4. **🐳 Build Docker Image** - Creates Docker image with build number tag
5. **⬆️ Push** - Pushes to Docker Hub (only on main branch)
6. **🚀 Deploy** - Runs docker-compose to start containers
7. **✅ Health Check** - Verifies app is running on port 8080
8. **📊 Show Logs** - Displays application logs

---

## 🌐 Access Your Deployed App:

After successful deployment:
- **Web App**: http://localhost:8080
- **MySQL**: localhost:3307 (root/root123)
- **Jenkins**: http://localhost:8085

---

## 🔍 Troubleshooting

### Pipeline doesn't trigger from GitHub?
- Check: Jenkins → **Manage Jenkins** → **Configure System** → **GitHub**
- Add your GitHub Personal Access Token (Settings → Developer settings → Personal access tokens)
- Verify webhook delivery: GitHub Repo → Settings → Webhooks → Click webhook → Recent Deliveries

### Build fails?
- Check console output: Jenkins → Build → Console Output
- Check docker logs: `docker-compose logs app`
- Check Maven build: `mvn clean package -DskipTests` (run manually)

### Docker image push fails?
- Verify Docker Hub credentials are correct
- Check Jenkins credentials: http://localhost:8085/credentials/
- Run `docker login` manually to test

### Connection refused on 8080?
- Wait 15+ seconds for app to start (health check stage)
- Check if port 8080 is already in use: `netstat -ano | find "8080"`
- View logs: `docker-compose logs app`

---

## 📝 Optional: Slack Notifications

Add to Jenkinsfile to get Slack alerts:

```groovy
post {
    success {
        slackSend(
            channel: '#deployments',
            message: '✅ E-Commerce App deployed successfully!',
            color: 'good'
        )
    }
    failure {
        slackSend(
            channel: '#deployments',
            message: '❌ E-Commerce App deployment failed!',
            color: 'danger'
        )
    }
}
```

---

## 📋 Environment Variables Used:

| Variable | Value |
|----------|-------|
| `DOCKER_IMAGE_NAME` | ecommerce-app |
| `DOCKER_IMAGE_TAG` | ${BUILD_NUMBER} |
| `DOCKER_IMAGE_LATEST` | latest |
| MySQL Host | mysql (Docker network) |
| MySQL Port | 3306 |
| MySQL User | root |
| MySQL Password | root123 |
| Google Client ID | Configured in docker-compose.yml |
| Google Client Secret | Configured in docker-compose.yml |

---

## 🎯 Quick Reference Commands:

```bash
# View Jenkins logs
docker logs jenkins

# Restart Jenkins
docker restart jenkins

# Check Jenkins on port 8085
curl http://localhost:8085

# View app logs
docker-compose logs app -f

# View MySQL logs
docker-compose logs mysql -f

# Stop all containers
docker-compose down

# Rebuild everything
docker-compose up -d --build
```

---

**🚀 Your automated CI/CD pipeline is ready!**

Every push to the `main` branch will now automatically trigger a build, test, and deployment! ✨
