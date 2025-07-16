# 🍽️ SustainShare - Complete Setup Guide

**SustainShare** is a modern food donation platform connecting donors with charities to reduce food waste and fight hunger. This guide will help you set up and run the application successfully.

## 📋 Prerequisites

### For Backend (Java Spring Boot)

- **Java Development Kit (JDK) 17 or higher** (NOT JRE)
- **Maven 3.6+**
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)

### For Frontend (React)

- **Node.js 16+**
- **npm or yarn**

## 🚀 Quick Start

### 1. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

### 2. Backend Setup (Java Spring Boot)

#### Option A: Using IDE (Recommended)

1. Open `backend` folder in your Java IDE
2. Wait for dependencies to download
3. Run `BackendApplication.java`
4. Backend will start on `http://localhost:8080`

#### Option B: Using Command Line

```bash
# Navigate to backend directory
cd backend

# Ensure JAVA_HOME points to JDK (not JRE)
echo $JAVA_HOME  # On Windows: echo %JAVA_HOME%

# Run with Maven wrapper
./mvnw spring-boot:run  # On Windows: mvnw.cmd spring-boot:run

# Or compile and run
./mvnw clean install
./mvnw spring-boot:run
```

## 🔧 Troubleshooting Backend Issues

### Common Error: "No compiler is provided in this environment"

**Problem**: Maven is using JRE instead of JDK.

**Solutions**:

1. **Set JAVA_HOME to JDK path**:

   ```bash
   # Windows
   set JAVA_HOME=C:\Program Files\Java\jdk-17

   # macOS/Linux
   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
   ```

2. **Verify JDK installation**:

   ```bash
   javac -version  # Should show javac version
   java -version   # Should show java version
   ```

3. **Use IDE to run**: IDEs typically handle JDK configuration automatically.

4. **Install JDK if you only have JRE**:
   - Download from [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
   - Install and set JAVA_HOME properly

### Database Configuration

The application is configured to use **H2 in-memory database** for easy development:

- No external database setup required
- Database resets on each restart
- Access H2 console at: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:sustainshare`
  - Username: `sa`
  - Password: `password`

## 🎯 Application Features

### 🏠 Homepage

- **Animated counters** showing platform statistics
- **Modern gradient design** with floating animations
- **Responsive layout** for all devices

### 👤 User Roles & Features

#### 🍽️ Donors

- **Post food donations** with images and details
- **Manage active donations** with search and filter
- **Track impact** with analytics dashboard
- **View pickup routes** on interactive maps

#### ❤️ Charities

- **Browse available food** with real-time updates
- **Claim donations** and schedule pickups
- **Track pickup status** with GPS integration
- **Manage multiple pickups** efficiently

#### 🛡️ Administrators

- **Full platform control** with user management
- **Monitor all donations** and pickups
- **View analytics** and export data
- **Configure platform settings**

### 🛒 Food Menu & Cart

- **Indian cuisine variety** with authentic images
- **Smart filtering** by type, spice level, category
- **Shopping cart** functionality with checkout
- **Order tracking** with delivery information

### 🗺️ Map Integration

- **Leaflet.js integration** with OpenStreetMap
- **India-focused** with Hyderabad coordinates
- **Route visualization** between donors and charities
- **Real-time tracking** with distance calculations

## 🔐 Demo Accounts

### For Testing Different Roles:

**Donor Account:**

- Email: `rajesh@example.com`
- Password: `password123`

**Charity Account:**

- Email: `charity@helpinghands.org`
- Password: `password123`

**Admin Account:**

- Email: `admin@sustainshare.com`
- Password: `admin123`

## 🎨 Design Features

### Modern UI Components

- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** and smooth animations
- **Interactive hover states** and transitions
- **Dark/light theme** support

### Responsive Design

- **Mobile-first** approach
- **Tablet optimization** for medium screens
- **Desktop enhancement** for large displays
- **Touch-friendly** interface elements

## 🔄 Offline Functionality

The application includes **smart API fallback**:

- **Primary**: Attempts backend connection
- **Fallback**: Uses localStorage-based mock API
- **Seamless**: User experience remains consistent
- **Data persistence**: Local storage maintains state

## 📱 Mobile Features

### Progressive Web App (PWA) Ready

- **Responsive design** works on all devices
- **Touch gestures** for mobile interaction
- **Optimized images** for different screen sizes
- **Fast loading** with optimized assets

## 🚀 Production Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy 'build' folder to your hosting service
```

### Backend Deployment

```bash
cd backend
./mvnw clean package
# Deploy target/backend-*.jar to your server
java -jar target/backend-*.jar
```

### Environment Variables

```bash
# Backend
SPRING_PROFILES_ACTIVE=production
DATABASE_URL=your_production_database_url

# Frontend
REACT_APP_API_URL=your_backend_url
```

## 📊 Performance Optimizations

### Frontend

- **Code splitting** for faster initial load
- **Image optimization** with lazy loading
- **Component memoization** to prevent unnecessary re-renders
- **Bundle optimization** with webpack

### Backend

- **Connection pooling** for database efficiency
- **Caching strategy** for frequently accessed data
- **API response optimization** with pagination
- **Memory management** with proper garbage collection

## 🔒 Security Features

### Authentication & Authorization

- **Role-based access control** (RBAC)
- **JWT token management** (ready for implementation)
- **Input validation** and sanitization
- **CORS configuration** for API security

### Data Protection

- **Form validation** on client and server
- **SQL injection prevention** with JPA
- **XSS protection** with input encoding
- **Secure API endpoints** with Spring Security

## 🛠️ Development Tools

### Recommended Extensions (VS Code)

- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**

### Java Development (IntelliJ/Eclipse)

- **Spring Boot DevTools** for hot reload
- **Lombok plugin** for boilerplate reduction
- **Maven/Gradle integration**
- **Database tools** for H2 console access

## 📝 API Documentation

### Available Endpoints

#### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

#### Food Management

- `GET /api/food` - List all food items
- `POST /api/food` - Create food donation
- `DELETE /api/food/{id}` - Delete food item

#### Pickup Management

- `GET /api/pickups` - List all pickups
- `POST /api/pickups` - Schedule pickup
- `PUT /api/pickups/{id}` - Update pickup status

## 🎯 Future Enhancements

### Planned Features

- **Real-time notifications** with WebSocket
- **Payment integration** for premium features
- **Advanced analytics** with charts and graphs
- **Multi-language support** with i18n
- **Mobile app** with React Native

### Scalability Considerations

- **Microservices architecture** for better scaling
- **Redis caching** for session management
- **CDN integration** for static assets
- **Load balancing** for high availability

## 📞 Support & Contribution

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this guide for common solutions
- **Community**: Join our developer community

### Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🎉 Congratulations!

You now have a fully functional food donation platform with:

- ✅ Modern React frontend with beautiful UI
- ✅ Spring Boot backend with H2 database
- ✅ Role-based authentication system
- ✅ Interactive map integration
- ✅ Shopping cart functionality
- ✅ Admin dashboard with full control
- ✅ Mobile-responsive design
- ✅ Offline functionality
- ✅ Indian food variety with images

**Happy coding and thank you for helping fight hunger! 🍽️❤️**
