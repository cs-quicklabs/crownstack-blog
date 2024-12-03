---
title: 'Using Ag-Grid with React'
date: '2024-11-07'
lastmod: '2024-11-07'
tags: ['engineering', 'guide', 'react']
draft: false
summary: 'Guide to integrate ag-grid with react,react-query'
layout: PostSimple
images: []
authors: ['akash-srivastava']
---

AG Grid is a powerful and feature-rich data grid that, when combined with React, offers seamless data handling and a highly customizable UI. Throughout this blog, we’ve explored how to set up AG Grid, define columns, handle sorting, filtering, and cell rendering, and use custom editors for data manipulation.

This integration allows developers to build responsive, scalable, and performant grids that can handle large datasets while maintaining a smooth user experience. Whether you're working with **client-side or server-side data**, AG Grid provides the flexibility and tools needed to manage complex data scenarios. With styling options, themes, and advanced customization, it’s easy to tailor the grid to your specific project requirements.

### Problem

When building **data-intensive applications**, developers often struggle to efficiently manage large datasets with features like **pagination, sorting, filtering, and real-time updates**. While there are several table libraries available for React, many fall short in handling **high-performance use cases**—such as virtual scrolling for thousands of rows, server-side data fetching, or complex cell rendering—without significant performance degradation. Additionally, customizing these libraries to meet enterprise-level needs, such as **column grouping, custom cell editors, and advanced data manipulation**, often requires significant effort and workarounds.

### How Ag grid solves it !

**1.Handling Large Datasets with High Performance**

Other table libraries struggle with rendering large datasets efficiently, often resulting in performance issues like lag, crashes, or slow rendering.

AG Grid provides **virtual scrolling (infinite scrolling)**, which only renders the rows currently visible in the viewport. This **lazy loading approach** ensures that performance remains smooth even with datasets containing **thousands or millions of rows**.

- **Row and Column Virtualization**: Only visible elements are rendered in the DOM, reducing memory consumption.
- **Server-Side Row Model**: Fetches data on-demand from the backend, allowing efficient data handling for real-time dashboards or applications with dynamic data.
- **Cache Management**: AG Grid uses **block caching** to avoid unnecessary re-fetches of previously loaded data.

**2\. Server-Side Integration and Real-Time Updates**

Many table libraries are limited to client-side data operations, making it challenging to integrate with backend systems for **server-side sorting, filtering, and pagination**.

AG Grid offers **server-side row models** that allow the grid to communicate directly with backend APIs. This makes it easier to work with **large, remote datasets** where sorting, filtering, and pagination are handled on the server. AG Grid can efficiently display only the data required for the current view, improving both performance and usability.

- **Integration with React Query**: Supports **server-side fetching** with tools like TanStack Query to manage data fetching and caching seamlessly.
- **Real-Time Data Handling**: AG Grid can dynamically update rows when the backend provides **new or updated data**. This is crucial for real-time applications, such as financial dashboards or IoT monitoring systems.

**Example with react-query(tanstack-query)**

```javascript
import { IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { queryClient } from '@tanstack/react-query'; // Ensure QueryClient is configured
import { getSessions } from './api'; // Your API call to fetch session data

const serverDataSource: IDatasource = {
  getRows: async (getRowParams: IGetRowsParams) => {
    const { startRow, successCallback, failCallback } = getRowParams;
    const limit = getRowParams.endRow - getRowParams.startRow;
    const orderBy = sortModelItemToOrderBy(getRowParams.sortModel) || 'created_at:desc';

    try {
      // Fetch data using React Query's `fetchQuery`
      const results = await queryClient.fetchQuery(
        ['getSessions', getRowParams.startRow], // Unique cache key based on startRow
        () =>
          getSessions({
            ...apiParams?.current,
            offset: getRowParams.startRow,
            limit,
            order_by: orderBy,
          }),
        { staleTime: 0 } // Ensure data is always fresh
      );

      const fetchedData = results.data.data;
      let lastRow = -1;

      // Check if it's the last set of rows
      if (fetchedData.length < limit) {
        lastRow = startRow + fetchedData.length;
      }

      // Filter data where status is 'ready'
      const filteredSessions = fetchedData.filter((item) => item.status === 'ready');

      // Set state for other components if needed
      setSessions(filteredSessions);

      // Send data to AG Grid
      successCallback(getCellVisualizationData(fetchedData), lastRow);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      failCallback(); // Handle fetch failure
    }
  },
};
```

### Explanation of the Code

1. **IDatasource Implementation**:  
   We implement the `getRows` method, which AG Grid calls when it needs data for a range of rows. This method handles:

   - **Pagination**: Using `startRow` and `endRow` to determine the range of data to fetch.
   - **Sorting**: Converting AG Grid’s `sortModel` to an API-compatible format.

2. **Fetching Data with React Query**:  
   We use `queryClient.fetchQuery` to **fetch data from the backend**. This ensures the query is cached and manages the loading state efficiently. The `staleTime: 0` ensures the data is always fresh when fetched.
3. **Filtering and Data Preparation**:  
   After fetching the data, we **filter rows** with the `status` set to `"ready"`. The function `getCellVisualizationData` is used to prepare the data before passing it to AG Grid.
4. **Success and Failure Callbacks**:

   - `successCallback`: Provides the fetched data and tells AG Grid how many rows were returned (or the **last row** if it’s the end of the dataset).
   - `failCallback`: Handles errors in case the fetch operation fails

Once the server data source is ready, we need to configure AG Grid to use it. This is done in the `onGridReady` event.

```javascript
const onGridReady = (params: GridReadyEvent) => {
  params.api.sizeColumnsToFit(); // Adjust columns to fit the available space
  setTableGridApi(params.api); // Store the Grid API for further use
  setColumnApi(params.columnApi); // Store the Column API for further use

  // Set the server-side data source
  params.api.setDatasource(serverDataSource);
};
```

### Explanation

- `onGridReady`: This event is triggered when the grid is fully initialized.
- `sizeColumnsToFit`: Ensures the columns adjust to fit the grid’s available space.
- `setDatasource`: Connects the server-side data source to the grid, enabling it to fetch data on-demand.

- `setTableGridApi`: React useState hook setter to set the value.

- `setColumnApi`: React useState hook setter to set the value.

Rendering the AG Grid Component

```javascript
<AgGridReact
  columnDefs={[
    { headerName: 'Session Name', field: 'name' },
    { headerName: 'Created At', field: 'created_at', sortable: true },
  ]}
  defaultColDef={{ flex: 1, sortable: true, filter: true }}
  rowModelType="infinite" // Enables server-side data fetching
  onGridReady={onGridReady}
  paginationPageSize={50} // Number of rows per page
  cacheBlockSize={50} // Cache size for each block of data
  className="ag-theme-alpine"
  style={{ height: 600, width: '100%' }}
/>
```

3\. **Advanced Features for Enterprise Use Cases**

Basic table libraries often lack advanced features required by enterprise applications, such as **custom cell editors, column grouping, and multi-level filtering**. Implementing these features usually requires complex workarounds.

AG Grid provides **out-of-the-box support** for advanced features such as:

- **Custom Cell Editors and Renderers**: Allows developers to inject custom components into cells for editing or displaying complex content (e.g., dropdowns, images, or buttons).
- **Column Grouping and Aggregation**: Supports hierarchical column structures, essential for financial reports or analytics dashboards.
- **Multi-Level Filtering**: Offers built-in filtering with support for text, number, date, and custom filters.
- **Row Grouping and Pivoting**: Enables powerful data transformation directly within the grid, similar to Excel-style pivot tables.

### Row Sorting

AG Grid supports column-based sorting. Adding the `sortable: true` property to a column definition allows users to sort the grid by clicking the column header.

You can also configure sorting behavior programmatically:

```javascript
<AgGridReact columnDefs={columnDefs} rowData={rowData} defaultColDef={{ sortable: true }} />
```

This configuration makes **all columns sortable by default** using `defaultColDef`.

### Multi Column Sorting

By holding down the **Shift key**, users can apply multi-column sorting. If you'd like to enforce this programmatically, you can enable it with:

```javascript
<AgGridReact
  columnDefs={columnDefs}
  rowData={rowData}
  multiSortKey="ctrl" // Use Ctrl key for multi-sorting
/>
```

### Filtering

AG Grid offers various filtering options. By adding `filter: true` in a column definition, users can filter data using an input box.

**Example of column filter:**

```javascript
const columnDefs = [
  { headerName: 'ID', field: 'id' },
  { headerName: 'Name', field: 'name', filter: 'agTextColumnFilter' },
  { headerName: 'Age', field: 'age', filter: 'agNumberColumnFilter' },
]
```

**Common Filters:**

- `agTextColumnFilter`: For text-based filtering (e.g., names).
- `agNumberColumnFilter`: For numeric filtering (e.g., age).
- `agDateColumnFilter`: For date filtering.

## Cell Rendering in AG Grid

AG Grid allows you to customize how data is displayed in cells using **Value Getters**, **Value Formatters**, **Cell Renderer Functions**, and **Cell Renderer Components**. This section will explore these customization techniques to help you present your data exactly the way you need.

### Value Formatter

A **Value Formatter** formats a value for display without altering the underlying data. This is helpful when you need to format dates, currencies, or numbers.

**Example:**

```javascript
const columnDefs = [
  {
    headerName: 'Price',
    field: 'price',
    valueFormatter: (params) => `$${params.value.toFixed(2)}`,
  },
  { headerName: 'Quantity', field: 'quantity' },
]
```

### Provided Cell Editors

AG Grid comes with several built-in editors to handle common editing needs like text, numbers, and selection options. You can enable editing by setting the `editable` property on columns.

If the provided editors don’t meet your requirements, you can create a **custom cell editor component** using React. This allows you to render complex inputs such as date pickers, sliders, or any other interactive components inside a cell.

Example: Creating a Custom Cell Editor Component

```javascript
import React, { useState, useEffect, useRef } from 'react'

const AgeCellEditor = (props) => {
  const [value, setValue] = useState(props.value)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus() // Automatically focus the input field on edit
  }, [])

  const handleChange = (e) => setValue(e.target.value)

  return (
    <input
      ref={inputRef}
      type="number"
      value={value}
      onChange={handleChange}
      style={{ width: '100%' }}
    />
  )
}

export default AgeCellEditor
```

Now, let’s use the `AgeCellEditor` in the grid for the `Age` column:

```javascript
import { AgGridReact } from '@ag-grid-community/react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import AgeCellEditor from './AgeCellEditor'

const MyGridComponent = () => {
  const rowData = [
    { name: 'Alice', age: 25, status: 'Active' },
    { name: 'Bob', age: 30, status: 'Inactive' },
  ]

  const columnDefs = [
    { headerName: 'Name', field: 'name', editable: true },
    {
      headerName: 'Age',
      field: 'age',
      editable: true,
      cellEditor: AgeCellEditor,
    },
    {
      headerName: 'Status',
      field: 'status',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Active', 'Inactive'] },
    },
  ]

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  )
}

export default MyGridComponent
```

4\. **Extensive Customization and Theming**

Developers often need to go beyond default table behavior to meet complex design requirements. However, customizing other table libraries can be cumbersome and limited.

**Solution:**  
AG Grid provides **extensive customization options** to meet any design or interaction needs:

- **Theming Support**: Comes with multiple pre-built themes (e.g., Alpine, Balham) and allows custom themes using CSS or SCSS.
- **Cell and Row Styling**: Offers powerful APIs for **conditional styling** based on cell or row data.
- **Custom Events and Callbacks**: Gives full control over user interactions with rich APIs for events like row selection, cell editing, and sorting changes.

AG Grid offers various ways to customize the look and feel of your grid through **cell styling**, **row styling**, and **themes**. This flexibility allows you to create a visually appealing grid that aligns with your application’s design.

### Cell Styling

Cell styling in AG Grid allows you to dynamically style individual cells based on their content or other logic. You can apply inline styles using the `cellStyle` property or define CSS classes through the `cellClass` property.

**Example: Inline Cell Styling**

```javascript
const columnDefs = [
  {
    headerName: 'Price',
    field: 'price',
    cellStyle: (params) => ({
      color: params.value > 50 ? 'green' : 'red',
      fontWeight: 'bold',
    }),
  },
  { headerName: 'Product', field: 'product' },
]
```

In this example:

- If the **price** is greater than 50, the text is styled **green**; otherwise, it's **red**.
- The `fontWeight` is set to **bold** for all price values.

### Example: Applying CSS Classes with `cellClass`

```javascript
const columnDefs = [
  {
    headerName: 'Status',
    field: 'status',
    cellClass: (params) => (params.value === 'Active' ? 'status-active' : 'status-inactive'),
  },
]
```

```javascript
/* CSS */
.status-active {
  color: white;
  background-color: green;
}

.status-inactive {
  color: white;
  background-color: red;
}
```

Here, the `status-active` and `status-inactive` CSS classes are conditionally applied based on the **status** value.

### Row Styling

You can customize row appearance dynamically using `rowStyle` and `rowClass`. This is useful when you want to style rows based on their data or state (e.g., highlighting specific rows).

**Example: Row Styling with Inline Styles**

```javascript
const rowStyle = (params) => ({
  backgroundColor: params.data.status === 'Inactive' ? '#f8d7da' : 'white',
})
```

```javascript
<AgGridReact
  columnDefs={[
    { headerName: 'Name', field: 'name' },
    { headerName: 'Status', field: 'status' },
  ]}
  rowData={[
    { name: 'Alice', status: 'Active' },
    { name: 'Bob', status: 'Inactive' },
  ]}
  getRowStyle={rowStyle}
/>
```

### Conclusion

AG Grid goes beyond the limitations of typical table libraries by offering a **high-performance, feature-rich, and highly customizable solution** for React applications. With its **virtual scrolling, server-side integration, advanced customization options, and enterprise-level features**, AG Grid is the perfect choice for developers building data-intensive applications. Whether you need to handle **massive datasets** or implement **complex business logic**, AG Grid ensures that your application remains fast, responsive, and user-friendly at all times.
