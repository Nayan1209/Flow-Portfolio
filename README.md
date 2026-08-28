# Flow Portfolio

An interactive portfolio for **Nayan Asati**, designed as a visual flow network instead of a traditional page-by-page portfolio.

## Overview

The portfolio treats the interface itself as a navigable network. **NAYAN ASATI** is the persistent root node, with major sections branching from it and deeper nodes progressively opening as the user explores.

The experience is built around:

- visual relationships instead of conventional page navigation
- progressive zoom and focus
- persistent ancestry while drilling into the network
- interactive nodes and connection paths
- camera pan and scroll zoom
- responsive desktop and mobile layouts

## Current Network

The home network connects the root identity to:

- **Projects**
- **Experience**
- **Skills**
- **Philosophy**
- **Contact**
- **About**

The home view also exposes smaller related nodes beneath their respective sections, allowing visitors to see the structure before opening deeper levels.

### Projects

The Projects branch includes portfolio project nodes such as:

- JobPilot AI
- Iron Akhada
- Nayan Asati Portfolio
- Ghouls Photography
- PyLauncher
- Windows UI / related project work

### Experience

Experience is represented as its own branch so professional history can be explored without leaving the network model.

## Navigation Model

The core interaction follows a persistent hierarchy:

```text
NAYAN ASATI
      │
      └── PROJECTS
             │
             └── JOBPILOT AI
                    │
                    └── deeper details
```

When a node is opened, the previous nodes **do not disappear**. Instead:

1. The focused node becomes larger and moves into focus.
2. Its parent remains visible as a smaller node.
3. Higher-level ancestors become progressively smaller/farther away.
4. Connection lines preserve the relationship between each level.
5. The newly focused node can expose its own children.

This creates a continuous exploration path rather than switching between unrelated screens.

## Interaction Features

- Click any node to focus and expand it
- Persistent root and ancestry nodes
- Progressive node scaling during navigation
- Short, readable connection paths
- Hover states and active connection highlighting
- Drag / pan camera movement
- Scroll-to-zoom
- Zoom controls
- Reset / return navigation
- Keyboard interaction support
- Responsive desktop and mobile behavior
- Larger adaptive nodes for longer labels so text remains readable
- Subtle animated network lines, particles and node motion
- Reduced-motion support

## Technology

- Next.js 14
- React 18
- TypeScript
- CSS
- Lucide React icons
- GitHub-based development workflow
- Vercel deployment

The project uses the standard Next.js scripts for development, production builds and linting. fileciteturn47file0L2-L2

## Design Direction

The visual direction is intentionally dark, minimal, technical and futuristic. The network is the primary navigation surface, with restrained typography, thin connection lines, subtle motion and progressive discovery.

The goal is to make the portfolio feel like an **interactive system map** rather than a conventional resume website.

## Development Workflow

Development is maintained directly through GitHub. The stable implementation is kept on the `main` branch.

Changes are committed to `main` and can flow through the connected Vercel deployment pipeline.

## Source Material

Portfolio profile, professional experience and project information are based on the supplied Nayan Asati profile and project/design materials.

## Status

**Active development / production portfolio**

The current implementation focuses on the interactive network foundation, persistent ancestry navigation, readable node layouts and deeper flow exploration.