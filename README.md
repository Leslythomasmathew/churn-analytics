# Customer Churn Analytics Dashboard

A modern, high-fidelity customer churn analytics dashboard designed for **Your Choice Retail Brand**. The application provides interactive sensitivity analysis and risk profiling for 157 unique customers across multiple product segments (Gents, Ladies, Kids) and categories (Formal, Casual, Athletic, Accessories).

### 🚀 Live Website
Access the live deployment (no password or tunnels required):  
👉 **[https://churn-gents-formal-all-products.surge.sh](https://churn-gents-formal-all-products.surge.sh)**

---

## Key Features

- **Interactive Churn Sensitivity Slider:** Adjust the churn threshold between 30 to 90 days of customer inactivity to see overall rates, counts, and active vs. churned charts recalculate instantly.
- **Dynamic Segment & Category Breakdown:** Visualization charts showing customer distribution and churn status by Acquisition Channel, Zonal Market, Product Segment, and Category.
- **Advanced Customer Registry Table:** Filter registry listings by multiple dimensions (channel, zone, segment, category, status, returns), search by customer name, and sort columns by lifetime spend, order count, and recency.
- **Cohort Retention Matrix:** MoM cohort retention matrix heatmap indicating percentage return rates for newly acquired customer cohorts.
- **Vibrant Dark Aesthetics:** Built with a modern dark slate palette, glassmorphism cards, HSL tailwind accents, and clean *Outfit* typography.

---

## Project Contribution & Impact

### 1. Business & Decision-Support Contribution
* **Revenue Risk Mitigation:** Identifies high-value customers who are drifting away. For example, the dashboard reveals that the **Formal Wear** category represents the largest active segment but also experiences a high churn rate (over 39%), making it a prime candidate for retention campaigns.
* **Sensitivity Calibration:** Retailing doesn't have a single definition of "churn." The dynamic slider allows users to adjust the inactivity threshold from 30 to 90 days to align churn definitions with seasonal purchasing cycles.
* **Return Policy Correlation:** The **Order Return Impact** chart analyzes return behaviors and reveals that customers who completed a return process actually exhibit *higher* retention rates, proving that efficient customer service during return interactions acts as a retention driver.
* **Cohort Health Lifecycle Tracking:** The **Cohort Heatmap** tracks Month-over-Month (MoM) retention curves to measure how repeat purchase rates decay, pinpointing exactly where engagement drops off (e.g., Month 2 drop-offs).

### 2. Engineering & Technical Contribution
* **Zero-Latency In-Browser Calculations:** Built with a fully client-side state engine in React 19. All metric recalculations, multi-dimension filtering, searching, and sorting are executed instantly in-browser without requiring backend round-trips.
* **Responsive Visualizations:** Implemented fully responsive Chart.js components that adapt cleanly across mobile, tablet, and desktop viewports.
* **Advanced Multi-Column Filtering:** Implemented a unified customer registry table supporting multi-criteria filter predicates and numerical sorting across dimensions like lifetime spend, purchase frequency, and recency.

---

## Tech Stack

- **Core Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (native Vite integration)
- **Charts:** Chart.js
- **Icons:** Lucide React

---

## Local Development Setup

To run this project locally:

### 1. Clone the repository
```bash
git clone https://github.com/Leslythomasmathew/churn-analytics.git
cd churn-analytics
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 4. Build for production
```bash
npm run build
```
Production-ready files will be generated in the `dist` folder.
