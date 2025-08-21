# Implementing Advanced Drag & Drop with dnd-kit and Plotly.js in React

Drag and drop functionality has become essential for modern data visualization interfaces. When working with complex scatter plots that need interactive reordering capabilities, combining **dnd-kit** with **Plotly.js** creates an elegant solution for intuitive data manipulation. In this article, we'll explore how we built a sophisticated drag and drop system that overlays interactive elements on top of Plotly.js charts.

## The Challenge: Interactive Plot Reordering

Traditional scatter plots are static - users can view data but cannot meaningfully interact beyond basic zoom and pan operations. Our challenge was enabling users to drag and drop plot sections to reorder data dimensions dynamically, while maintaining Plotly.js's rich visualization capabilities.

### Key Requirements

- **Seamless Integration**: Overlay that doesn't interfere with chart functionality
- **Visual Feedback**: Clear indicators during drag operations
- **Smart Collision Detection**: Support both adjacent swapping and precise positioning
- **Performance**: Smooth animations without compromising chart performance
- **Accessibility**: Full keyboard and screen reader support

## Why dnd-kit + Plotly.js?

**dnd-kit** provides modern React architecture with accessibility built-in, while **Plotly.js** delivers powerful charting. Together they offer:

- **Type Safety**: Full TypeScript support
- **Accessibility**: Built-in keyboard navigation and screen reader support
- **Performance**: Optimized for complex layouts with minimal re-renders
- **Flexibility**: Customizable sensors and collision detection

## Architecture Overview

Our solution uses an overlay approach with four main components:

1. **GridTileOverlay** - Main drag context container
2. **DraggableGridTile** - Individual draggable elements
3. **useDragHandlerAnnotations** - Visual cues within the chart
4. **gridPositionUtils** - Coordinate conversion utilities

## What We're Building

The drag and drop functionality allows users to reorder data sections by dragging interactive overlay areas positioned over chart sections. Users can:

- **Hover** over chart sections to see draggable indicators
- **Drag** sections to new positions with visual feedback
- **Drop** to reorder data, with the chart updating automatically

## Implementation Approach

### 1. Basic Plotly.js Setup

Start with a standard Plotly.js chart:

```jsx
import Plot from 'react-plotly.js'

const ScatterPlot = ({ data, layout }) => {
  return (
    <div style={{ position: 'relative' }}>
      <Plot data={data} layout={layout} style={{ width: '100%', height: '500px' }} />
      {/* Overlay will go here */}
    </div>
  )
}
```

### 2. Adding dnd-kit Overlay

Create draggable areas that overlay the chart:

```jsx
import { DndContext, useSortable, SortableContext } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const DraggableArea = ({ id, bounds }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        transform: CSS.Transform.toString(transform),
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: isDragging ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
        border: isDragging ? '2px dashed #007bff' : 'none',
      }}
      {...attributes}
      {...listeners}
    />
  )
}
```

**Key Concepts:**

- **Overlay Approach**: Transparent draggable areas positioned over chart sections
- **Visual Feedback**: Clear indicators during drag operations
- **Responsive Positioning**: Areas adjust to chart dimensions

### 3. Complete Integration

Put everything together with drag handling:

```jsx
const InteractivePlot = ({ plotData, onDataReorder }) => {
  const [sections, setSections] = useState(['Section A', 'Section B', 'Section C'])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setSections((prevSections) => {
      const oldIndex = prevSections.indexOf(active.id)
      const newIndex = prevSections.indexOf(over.id)

      // Simple reorder logic
      const result = [...prevSections]
      result.splice(oldIndex, 1)
      result.splice(newIndex, 0, active.id)

      onDataReorder(result) // Update chart data
      return result
    })
  }

  return (
    <div style={{ position: 'relative' }}>
      <Plot data={plotData} layout={layout} />

      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={sections}>
          {sections.map((section, index) => (
            <DraggableArea
              key={section}
              id={section}
              bounds={calculateSectionBounds(index, sections.length)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
```

This creates a smooth drag and drop interaction with real-time visual feedback during the drag operation.

## Key Technical Challenges

### 1. Positioning Calculations

The main challenge is aligning draggable overlays with chart sections:

```jsx
// Calculate section boundaries based on data
const calculateSectionBounds = (index, totalSections) => {
  const containerWidth = 800 // Chart width
  const sectionWidth = containerWidth / totalSections

  return {
    left: `${index * sectionWidth}px`,
    top: '0px',
    width: `${sectionWidth}px`,
    height: '500px', // Chart height
  }
}
```

### 2. Responsive Design

Use percentage-based positioning for different screen sizes:

```jsx
const calculateResponsiveBounds = (index, totalSections) => {
  const sectionWidthPercent = 100 / totalSections

  return {
    left: `${index * sectionWidthPercent}%`,
    top: '0%',
    width: `${sectionWidthPercent}%`,
    height: '100%',
  }
}
```

The overlay areas automatically adjust to different screen sizes, ensuring consistent interaction across devices.

### 3. Adding Visual Cues

Enhance the chart with visual indicators for draggable areas:

```jsx
// Add annotations to show drag handles
const createDragAnnotations = (sections) => {
  return sections.map((section, index) => ({
    text: '⋮⋮', // Drag handle icon
    x: index + 0.5, // Center of each section
    y: 1.05, // Above the chart
    xref: 'x',
    yref: 'paper',
    showarrow: false,
    font: { size: 16, color: '#666' },
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    borderwidth: 1,
  }))
}

// Update your plot with annotations
const plotLayout = {
  ...baseLayout,
  annotations: createDragAnnotations(sections),
}
```

These visual cues help users immediately identify which areas of the chart are interactive and draggable.

## Advanced Features

### Smart Interaction Modes

Support both quick adjacent swaps and precise positioning:

```jsx
// Configure sensors for better user experience
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }, // Prevent accidental drags
  }),
  useSensor(KeyboardSensor) // Keyboard accessibility
)

// Handle different types of reordering
const handleDragEnd = (event) => {
  const { active, over } = event
  if (!over) return

  const activeIndex = sections.indexOf(active.id)
  const overIndex = sections.indexOf(over.id)

  // Reorder sections array
  const newSections = arrayMove(sections, activeIndex, overIndex)
  setSections(newSections)

  // Update chart data to match new order
  updateChartData(newSections)
}
```

This approach supports both quick adjacent swaps for fast reordering and precise positioning for complex arrangements.

## Key Technical Insights

### Performance Optimizations

- **Smart Sensors**: 8px activation distance prevents accidental drags
- **Percentage-Based Positioning**: Ensures consistent behavior across screen sizes
- **Conditional Rendering**: Skip overlay when drag is disabled
- **Early Returns**: Exit collision detection quickly when possible

### Accessibility Features

- **Keyboard Support**: Full navigation via KeyboardSensor
- **Visual Cues**: Clear grab/grabbing cursor states
- **Screen Reader**: Proper semantic markup and ARIA attributes

### Error Handling

- **Graceful Degradation**: Disable interactions when drag isn't available
- **Fallback Detection**: Use closest-center when custom detection fails
- **Boundary Checks**: Ensure positions stay within valid ranges

## Lessons Learned

### 1. Coordinate System Complexity

Converting between chart coordinates and DOM positions requires careful handling of:

- **Scale Transformations**: Plot bounds to viewport percentages
- **Responsive Design**: Consistent behavior across screen sizes
- **Axis Orientations**: Chart vs. DOM coordinate systems

### 2. User Experience Design

- **Activation Thresholds**: 8px prevents accidental drags while staying responsive
- **Dual Interaction Modes**: Support both quick swaps and precise positioning
- **Visual Feedback**: Immediate response guides user interactions
- **Graceful Degradation**: Disable smoothly when not needed

### 3. Performance Patterns

- **Percentage-Based Math**: Avoids expensive DOM queries during drag
- **Smart Collision Detection**: Early returns and efficient algorithms
- **Conditional Rendering**: Skip processing when features are disabled

## Conclusion

Combining **dnd-kit** with **Plotly.js** creates powerful interactive data visualizations that go beyond traditional static charts. The key challenges involve:

- **Coordinate System Translation**: Converting between different coordinate spaces
- **Smart Collision Detection**: Supporting multiple interaction patterns
- **Performance Optimization**: Maintaining smooth interactions
- **Accessibility**: Ensuring inclusive user experiences

The result is an intuitive interface where users can dynamically reorganize data visualizations through natural drag and drop interactions, while preserving all the analytical power of modern charting libraries.

This approach demonstrates how thoughtful integration of specialized React libraries can solve complex interaction design challenges in data visualization applications.

---

**Core Dependencies:**

- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- react-plotly.js
- @mui/material
- TypeScript
