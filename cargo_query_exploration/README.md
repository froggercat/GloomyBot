# How to extract latest API schema:

1. Go to https://dragalialost.gamepedia.com/Special:CargoQuery and run the following commands from the console (tested in Chrome):
2. ```javascript
    tables = $("#ui-id-1 a").toArray().map(a=>$(a).text()).filter(t=>t.indexOf("_")<0) // get list of tables populated via autocomplete on page load
    getFields = () => $("#ui-id-2 a").toArray().map(a=>$(a).text()).filter(t=>t.indexOf("_")<0) // func to get list of available fields generated per table after you have populated the tables field
    schema = {}
    ```
3. The following function will create a dictionary of the schema. It uses the page's autocomplete functionality, so you may need to tweak the timing depending on network conditions.
    ```javascript
    getData = () => tables.forEach((table, i) => {
        if (i===0) $('input#fields').blur(); // you have to close the field input to enter new values in tables, I'm attempting to close it in case you left it open after playing around with queries
        setTimeout(() => {
            $("input#fields").blur() // you gotta close the field input in order to input another table
            $('input#tables').val(table)
            $("input#fields").click() // this triggers field autocomplete to populate for selected table(s)
            // Poll a few times to grab the generated autocomplete when it populates; load time for each table varies, and if you miss your window you'll pick up the fields for another table.
            let counter = 0
            let myInterval = setInterval(() => {
                let myFields = fields()
                if (myFields[0].includes(table)) {
                    schema[table] = myFields;
                    clearInterval(myInterval)
                }
                if (counter >= 5) clearInterval(myInterval)
                counter++
            }, 50)
        }, 500*(i+1)) // Don't run too fast or the field autocomplete won't have time to load between tables
    })
    ```
4. Select the first table from the tables list, click into the Fields list to force autocomplete to populate for the first table, then exit it.
    
    I know there's lots of handling for this in the function above, but it doesn't really work right still. If you don't do this, the first table may get assigned the fields of the previous table you looked at.
5. `getData()`
6. `copy(JSON.stringify(schema))`
7. In `schema.py`, assign variable schema to the contents of your clipboard.


# How to regenerate table data:

From the `cargo_query_exploration` directory:

`python getDataTables.py`

# Next Steps

* Convert this to Cedar (or whatever its called)