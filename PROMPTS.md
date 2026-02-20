# AI Assistance Prompts

This project was developed with the assistance of an AI coding agent. As per transparency requirements, below is a chronological log of the primary prompts and directions provided by the user to the AI to generate the source code, architecture, and features of this repository.

### Initial Architecture & Setup
1. **Initial Project Request:** "Design and implement a high-quality, production-ready Go backend for an Expense Tracker with Bill Splitting system. The core requirements include a layered architecture, financial data safety (avoiding floating-point errors), an efficient settlement algorithm that minimizes transactions, and a clear separation of concerns within the project structure. The tech stack is Go, Gin PostgreSQL, React, Vite, and Tailwind."
2. **Core Engine Focus:** "let's start with the basic core engine."
3. **Database Selection:** "i want you to use postgresql but if u think it will be overkill then we can use in-memory." *(The AI and user decided to proceed with an in-memory repository for development speed, ensuring the architecture allowed swapping to Postgres later).*

### Frontend Development & Debugging
4. **Server Execution:** "Can you run both the backend and frontend servers so I can see what it looks like?"
5. **Build Fixes:** "can you fix the frontend build issues, there seems to be a vite error."
6. **UI Debugging:** "the website runs, but it's just a blank white screen. Can you debug the frontend console errors?"
7. **Navigation Implementation:** "can you make the other side bar pages navigate to some nice looking mockup pages instead of just being empty."
8. **User Connectivity:** "the backend is missing the endpoints for user management and the friends page isn't fetching anything."

### Advanced Feature Implementation
9. **Full Feature Implementation:** "Now start adding the full logic for custom splits, activity feed, and settings page with currency context, and add data visualization graphs using recharts."
10. **Settings Polish:** "notification security and payment methods are not working in security settings."
11. **Additional Visualizations:** "try to add some other graphs also to the activity feed."

### Cleanup & Finalization 
12. **Workspace Optimization:** "now delete the files that are not useful."
13. **Source Code Check:** "which are source code file are all the files source code file."
14. **GitHub Preparation:** "i have to upload these following files into github repository. The repository should include complete source code, README, DESIGN, and all prompts used."
