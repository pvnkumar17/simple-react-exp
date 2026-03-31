graph TB
    User["👤 User Browser"]
    
    subgraph "Request 1: Load Entry Point"
        User -->|GET /new/index.html| Server["Server"]
        Server -->|302/200| User
        User -->|Static HTML Cache| Browser["🌐 Browser"]
    end
    
    subgraph "Request 2: Load Configuration (Async)"
        Browser -->|fetch /index-page/config| Controller["IndexPageController"]
        Controller -->|Checks Auth| AuthFilter["AuthenticationFilter"]
        AuthFilter -->|Gets Attributes| Servlet["Request Attributes"]
        Controller -->|IndexPageUtil| Utils["IndexPageUtil"]
        Utils -->|Reads Config| TenantSettings["TenantSettingsService"]
        Utils -->|Gets Theme| PersonalService["PersonalizationService"]
        Controller -->|Sets Headers<br/>Sets Cookie| Response["Response Headers"]
        Controller -->|JSON Config| Browser
    end
    
    subgraph "Request 3+: Load Resources (from config)"
        Browser -->|fetch /styles.css<br/>fetch /app.js| CDN["CDN or Server"]
        CDN -->|Resources| Browser
        Browser -->|Init App with<br/>Global Variables| App["Angular/React App"]
        App -->|Renders UI| User
    end
    
    style User fill:#e1f5ff
    style Browser fill:#fff3e0
    style Server fill:#f3e5f5
    style Controller fill:#e8f5e9
    style App fill:#fce4ec
