document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchSchemaButton').addEventListener('click', async () => {
        try {
            const response = await fetch('/fetch-schema');
            if (!response.ok) {
                throw new Error('Failed to fetch schema. Please try again.');
            }
            const schema = await response.json();
            displaySchemaFields(schema);
        } catch (error) {
            console.error('Error fetching schema:', error);
            showNotification(error.message, 'error');
        }
    });

    document.getElementById('dumpButton').addEventListener('click', async () => {
        try {
            const selectedClasses = Array.from(document.querySelectorAll('input[name="selectedClasses"]:checked'))
                .map(input => input.value);
            if (selectedClasses.length === 0) {
                throw new Error('No classes selected. Please select at least one class to dump.');
            }
    
            const response = await fetch('/dump', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedClasses })
            });
            if (!response.ok) {
                throw new Error('Failed to dump data. Please try again.');
            }
            const dumpData = await response.json();
            console.log('Dumped data:', dumpData);
    
            // Create a Blob containing the dumped data
            const blob = new Blob([JSON.stringify(dumpData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
    
            // Create a link element and trigger the download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'dumped_data.json';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
    
            showNotification('Selected classes dumped successfully.', 'success');
        } catch (error) {
            console.error('Error dumping data:', error);
            showNotification(error.message, 'error');
        }
    });
    
    
});

function displaySchemaFields(schema) {
    const schemaFieldsElement = document.getElementById('schemaFields');
    schemaFieldsElement.innerHTML = '';

    // Create a table
    const table = document.createElement('table');
    table.classList.add('schema-table');

    // Create a table header row
    const headerRow = document.createElement('tr');
    const classNameHeader = document.createElement('th');
    classNameHeader.textContent = 'Class Name';
    headerRow.appendChild(classNameHeader);
    const selectHeader = document.createElement('th');
    selectHeader.textContent = 'Select';
    headerRow.appendChild(selectHeader);
    table.appendChild(headerRow);

    // Create table rows for each class in the schema
    schema.forEach((obj) => {
        const row = document.createElement('tr');

        // Class name cell
        const classNameCell = document.createElement('td');
        classNameCell.textContent = obj.className;
        row.appendChild(classNameCell);

        // Checkbox cell
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = obj.className;
        checkbox.name = 'selectedClasses';
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);

        // Append the row to the table
        table.appendChild(row);
    });

    // Append the table to the schema container
    schemaFieldsElement.appendChild(table);

    // Show the dumpButton
    document.getElementById('dumpButton').style.display = 'block';
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Slide in the notification
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 100);
        }, 2000);
    }, 50);
}
