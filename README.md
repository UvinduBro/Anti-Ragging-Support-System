# Anti-Ragging-Support-System

# 🛡️ Anti-Ragging and Human Rights Support System for University Students

This open-source project is dedicated to protecting the rights, dignity, and freedom of university students by providing a digital platform to report ragging incidents, raise awareness, and support anti-ragging policies.

## 📌 Purpose

Ragging is a serious violation of human rights. Our mission is to empower students to live freely, without fear or harassment, and to foster a university environment built on respect, equality, and safety.

## 🎯 Features

- 📝 Anonymous ragging incident reporting system
- 📢 Awareness campaigns and digital posters
- 🧑‍⚖️ Admin & authority panel to manage reports
- 📊 Real-time statistics and alert system
- 🔒 Secure and confidential data handling
- 📚 Resources on student rights and anti-ragging laws

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/dularawe/anti-ragging-system.git
cd anti-ragging-system

```

## 🔧 Deployment Requirements

### Firebase Setup

1. Create a Firebase project
2. Enable Firestore Database
3. Create required indexes:
   - Collection: `reports`
   - Fields to index:
     - `status` (Ascending)
     - `createdAt` (Descending)

You can create the index by visiting this URL (replace PROJECT_ID with your Firebase project ID):
```
https://console.firebase.google.com/project/PROJECT_ID/firestore/indexes
```
