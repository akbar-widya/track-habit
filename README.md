# Minimalist Habit Tracker

A sleek, high-density habit tracker designed for low-friction daily execution. Features a rolling 7-day activity grid, GitHub-style performance heatmaps, and inline target metrics.

Currently, the application runs entirely in the browser using `localStorage` to ensure a fast, offline-first experience for the MVP.

## ✨ Current Features

- **Rolling 7-Day Grid:** Always keep "Today" in focus at the far right of your screen.
- **Low-Friction Tracking:** A 7-day grace period allows you to backfill missed check-ins without rigid penalties.
- **Performance Heatmap:** Visualize your consistency over the last 28 days with a GitHub-style activity grid.
- **High Information Density:** See your daily targets, units, and categories inline without cluttering the interface.
- **Local Persistence:** Your data is instantly saved to your browser's `localStorage`.

## 🛠️ Current Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React icons
- **Form Handling & Validation:** React Hook Form, Zod
- **Storage:** Browser `localStorage`

## 🚀 Roadmap

The next phase of development will transition the application from local browser storage to a robust local/server database architecture. Upcoming technologies include:

- **SQLite:** Lightweight, fast, and reliable database.
- **Drizzle ORM:** Type-safe database interactions and schema management.
- **BetterAuth:** Comprehensive authentication for multi-device sync and user accounts.

## 📦 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akbar-widya/track-habit.git
   ```
