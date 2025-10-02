# **App Name**: E-Shop Admin Panel

## Core Features:

- Login Authentication: Authenticate users via POST request to the FastAPI backend and store the token in local storage.
- Product Listing: Fetch product data from the FastAPI backend via GET request and display it on the main page, including images in a carousel and WhatsApp link with the product code.
- Admin Dashboard: Provide a protected admin dashboard accessible only to authenticated users with the 'admin' role, verified via a GET request to the FastAPI backend.
- Product Management (CRUD): Implement Create, Read, Update, and Delete operations for products using FastAPI endpoints to interact with the MongoDB database, including handling multiple images and boolean values for availability.
- Site Configuration Management: Enable administrators to modify site-wide content (H1, titles, paragraphs, contact data, WhatsApp number) via GET and PUT requests to the FastAPI backend, providing a centralized configuration panel.
- Access Control: Control the visibility of pages, denying access to the admin dashboard and pages if the user is not properly authenticated. A tool for automatically verifying roles from JWT and disallowing access.
- Product Description Generation: Use an AI tool to create and edit product descriptions. LLM will intelligently include available features in the description, based on product tags, metadata and current market trends.

## Style Guidelines:

- Primary color: A modern purple (#A052DE) to reflect technological innovation and user interaction. Its versatility suits various components while avoiding tech cliches.
- Background color: A desaturated purple (#F0E6EF), a light hue of the primary color that maintains the purple vibe while being light.
- Accent color: A contrasting, lighter purple (#D8BFD8) is used for highlighting interactive elements, creating a cohesive and visually appealing aesthetic.
- Font pairing: Use 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text. This provides a modern, tech-focused, neutral aesthetic with a combination of contemporary and geometric elements.
- Employ a set of modern, minimalist icons sourced from a consistent library, with visual metaphors where applicable, to ensure clarity and scannability of essential functions. The line weight should be balanced and match the 'Inter' font.
- Implement a clean, grid-based layout with consistent spacing and padding. Prioritize content hierarchy and ensure responsiveness across various screen sizes using TailwindCSS's responsive utilities. Incorporate a fixed header/menu and reusable footer components.
- Introduce subtle animations and transitions for interactive elements, such as button hover effects and carousel transitions. Use TailwindCSS's transition utilities to maintain a smooth, responsive experience.