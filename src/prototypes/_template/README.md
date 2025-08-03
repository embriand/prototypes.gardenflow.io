# Prototype Template

This is a template folder for creating new prototypes. Copy this folder and customize it for your new prototype.

## Setup Instructions

### 1. Copy Template
```bash
cp -r src/prototypes/_template src/prototypes/your-prototype-name
```

### 2. Rename Files
- Rename `PrototypeTemplate.tsx` to `YourPrototypeName.tsx`
- Update the import in `index.ts`

### 3. Update Content
- Define your types in `types.ts`
- Implement your component in the main file
- Update this README with your prototype documentation

### 4. Add to App Router
In `src/App.tsx`:
```tsx
import YourPrototypeName from './prototypes/your-prototype-name'

// Add route:
<Route path="/your-prototype-name" element={<YourPrototypeName />} />
```

### 5. Add to Home Page
In `src/pages/Home.tsx`, add to the prototypes array:
```tsx
{
  id: 'your-prototype-name',
  title: 'Your Prototype Name',
  path: '/your-prototype-name',
  description: 'Brief description of your prototype',
  status: 'development',
  lastModified: '2025-01-28',
  category: 'ui', // or 'landscape', 'chat', 'tools', 'api'
  size: 'medium',
  technologies: ['React', 'TypeScript'],
  complexity: 'medium'
}
```

### 6. Update Performance Tracking
Add your prototype to `performance.json`:
```json
{
  "id": "your-prototype-name",
  "name": "Your Prototype Name",
  "status": "migrated",
  "component": {
    "path": "src/prototypes/your-prototype-name",
    "dependencies": ["react", "other-deps"],
    "complexity": "medium",
    "category": "ui"
  }
}
```

## File Structure

Each prototype should follow this structure:
```
your-prototype-name/
├── index.ts              # Main export
├── YourPrototypeName.tsx # Main component
├── types.ts              # TypeScript types
├── utils.ts              # Utility functions (optional)
├── mockData.ts           # Sample data (optional)
├── styles.css            # Custom styles (optional)
└── README.md             # Documentation
```

## Best Practices

### Component Structure
- Keep the main component focused and clean
- Extract complex logic into separate files
- Use TypeScript for type safety
- Follow existing naming conventions

### Styling
- Use Tailwind CSS utilities
- Follow the existing design system
- Maintain consistent spacing and colors
- Ensure responsive design

### Documentation
- Update the README with clear descriptions
- Document all props and interfaces
- Include usage examples
- Note any dependencies or requirements

### Performance
- Keep bundle size reasonable
- Use lazy loading when appropriate
- Optimize for the specific use case
- Consider migration impact on main app

## Common Patterns

### State Management
```tsx
const [state, setState] = useState(initialState);
```

### Event Handling
```tsx
const handleClick = (event: React.MouseEvent) => {
  event.stopPropagation();
  // Handle click
};
```

### Conditional Rendering
```tsx
{condition && <Component />}
{loading ? <Loading /> : <Content />}
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## Testing

### Manual Testing
- Test all interactive elements
- Verify responsive behavior
- Check accessibility
- Validate error states

### Migration Testing
- Measure performance impact
- Test in isolation
- Verify no conflicts with other prototypes

## Migration Workflow

1. **Before Migration**: Measure baseline performance
2. **Migrate**: Move component to prototypes app
3. **Test**: Verify functionality in isolation
4. **Measure**: Record performance improvements
5. **Decide**: Keep in prototypes or integrate back to main app

This template provides a solid foundation for creating new prototypes while maintaining consistency and best practices.