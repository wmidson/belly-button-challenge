// API url
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json'
//fetch JSON data and console log it 
d3.json(url).then(function (data) {
    console.log(data);
});

//initialize page
function init() {

    //sel dropdown menu using d3
    let dropdownMenu = d3.select("#selDataset");

    //fetch JSON data and populate dropdown using d3
    d3.json(url).then((data) => {

        //set variable for sample names
        let names = data.names;

        //add the samples to dropdown menu
        names.forEach((id) => {

            //print id values for each iteration
            console.log(id);
            dropdownMenu
                .append("option")
                .text(id)
                .property("value", id);
        });

        //set 1st sample
        let sample_one = names[0];

        //print value of sample 1
        console.log(sample_one);

        //construct initital plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);

    });

};
//create function to populate metadata
function buildMetadata(sample) {

    //retrieve data using d3
    d3.json(url).then((data) => {

        //get the metadata
        let metadata = data.metadata;

        //set filter based on values in the sample
        let value = metadata.filter(result => result.id == sample);

        //print an array of metadata objects for after they've been filtered
        console.log(value)

        //from the array, find the first index 
        let valueData = value[0];

        //clear the metadata
        d3.select("#sample-metadata").html("");

        //add key/value pairs to the panel
        Object.entries(valueData).forEach(([key, value]) => {

            //print individual key/value pairs as they're appended to metadata 
            console.log(key, value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};
//create function to build bar chart
function buildBarChart(sample) {

    //fetch JSON data 
    d3.json(url).then((data) => {

        //find sample data
        let sampleInfo = data.samples;

        //set filter based on value of sample
        let value = sampleInfo.filter(result => result.id == sample);

        //get the 1st value from array
        let valueData = value[0];

        //get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //print it
        console.log(otu_ids, otu_labels, sample_values);

        //put top ten items in desc. order
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0, 10).reverse();
        let labels = otu_labels.slice(0, 10).reverse();

        //set up the trace for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        //build layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        //plot with plotly
        Plotly.newPlot("bar", [trace], layout)
    });
};
//create function to build the bubble chart
function buildBubbleChart(sample) {

    //fetch JSON data using d3
    d3.json(url).then((data) => {

        //find sample data
        let sampleInfo = data.samples;

        //set filter based on value of sample
        let value = sampleInfo.filter(result => result.id == sample);

        //get first value from array
        let valueData = value[0];

        //get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //print
        console.log(otu_ids, otu_labels, sample_values);

        //set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        //build the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
        };

        //plot with Plotly
        Plotly.newPlot("bubble", [trace1], layout)
    });
};
//create function that updates dashboard when sample changes
function optionChanged(value) {

    //print for a new value
    console.log(value);

    //call all of the functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Call the initial function
init();