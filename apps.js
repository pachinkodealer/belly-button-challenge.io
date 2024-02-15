const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

console.log(dataPromise.then(data => data.samples))
console.log(dataPromise.then(data => data.metadata))

// Function to populate the dropdown menu with options
function populateDropdown(data) {
    const dropdown = document.getElementById("selDataset2");
    dropdown.innerHTML = ""; // Clear existing options
  
    const emptyOption = document.createElement("option");
    emptyOption.value = ""; // Set value of empty option
    emptyOption.textContent = "Select an ID"; // Text to display for empty option
    dropdown.appendChild(emptyOption);

    // Populate options
    data.names.forEach((id, index) => {
      const option = document.createElement("option");
      option.value = id; // Use the ID directly as the value
      option.textContent = `ID ${id}`;
      dropdown.appendChild(option);
    });
  }


  // Function to handle option change
  function optionChanged(value) {
    console.log("Selected ID:", value);
    dataPromise.then(data => {
      // Convert value to the appropriate type for comparison
      const idToFindSamples = typeof data.samples[0].id === 'string' ? value.toString() : parseInt(value);
      const idToFindMetadata = typeof data.metadata[0].id === 'string' ? value.toString() : parseInt(value);
  
      const selectedId = data.samples.find(sample => sample.id === idToFindSamples); // Find the sample object by its ID
      const selectedMetadata = data.metadata.find(metadata => metadata.id === idToFindMetadata); // Find the metadata object by its ID
      console.log("Selected ID object:", selectedId);
      console.log("Selected metadata object:", selectedMetadata);
      updateVisualization(selectedId, selectedMetadata);
    });
  }
  
  
  // Wait for data to be fetched, then populate dropdown
  dataPromise.then(data => {
    populateDropdown(data);
  
    const dropdown = document.getElementById("selDataset2");
    dropdown.addEventListener("change", function(event) {
      optionChanged(event.target.value);
    });
  });
  
  // Function to update the visualization
  function updateVisualization(selectedId, selectedMetadata) {
    console.log("Selected ID in updateVisualization:", selectedId);
    console.log("Selected ID in Metadata:", selectedMetadata);
    GraphV(selectedId);
    createBubbleChart(selectedId);
    demoGraphic_Info(selectedMetadata);
    demoGraphic_Info2(selectedMetadata);
    }

 
  
  // Function to create a bar graph
  // Function to create a bar graph
// Function to create a bar graph
function GraphV(id) {
    let X1 = [];
    let Y1 = [];
    let text1 = [];
  
    // Get the first 10 OTU IDs
    let otuIds = id.otu_ids.slice(0, 10);
  
    // Create an array of objects containing both sample values and OTU IDs
    let dataArr = [];
    for (let i = 0; i < otuIds.length; i++) {
      let index = id.otu_ids.indexOf(otuIds[i]);
      dataArr.push({ sample_value: id.sample_values[index], otu_id: otuIds[i] });
    }
  
    // Sort the data array by sample values in descending order
    dataArr.sort((a, b) => a.sample_value - b.sample_value);
  
    // Extract sorted sample values and OTU IDs
    for (let i = 0; i < dataArr.length; i++) {
      X1.push(dataArr[i].sample_value);
      Y1.push(`OTU ${dataArr[i].otu_id}`);
      text1.push(id.otu_labels[dataArr[i].otu_id]);
    }
  
    // Plot the data
    let trace1 = {
      x: X1,
      y: Y1,
      type: "bar",
      text: text1,
      hoverinfo: "text",
      orientation: "h"
    };
  
    let layout = {
      yaxis: {
        tickvals: Y1,
        ticktext: Y1
      }
    };
  
    Plotly.newPlot("plot4", [trace1], layout);
  }
  
  // Function to create a bubble chart
// Function to create a bubble chart
function createBubbleChart(id) {

    // Calculate sizeref value
    var desired_maximum_marker_size = 40;
    var size = id.sample_values;
    var sizeref = 2.0 * Math.max(...size) / (desired_maximum_marker_size**2);
  
    var trace1 = {
      x: id.otu_ids,
      y: id.sample_values,
      text: id.otu_labels.map(label => `OTU ${label}`),
      mode: 'markers',
      marker: {
        size: id.sample_values,
        color: id.otu_ids,
        sizemode: 'area',
        sizeref: sizeref
      },
      type: 'scatter'
    };
  
    var data = [trace1];
  
    var layout = {
      title: 'Bubble Chart',
      showlegend: false,
      height: 600,
      width: 600,
      xaxis: {
        title: 'OTU ID' // Set x-axis title
      },
      yaxis: {
        title: 'Sample Values' // Set y-axis title
      }
    };
  
    Plotly.newPlot('bubbleChart', data, layout);
  }



// Function to display demographic information
function demoGraphic_Info(metadata) {
    // Extract demographic information
    const demographics = {
      id: metadata.id,
      ethnicity: metadata.ethnicity,
      gender: metadata.gender,
      age: metadata.age,
      location: metadata.location,
      bbtype: metadata.bbtype,
      wfreq: metadata.wfreq
    };
  
    // Display demographic information
    const demographicDiv = document.getElementById("sample-metadata");
    demographicDiv.innerHTML = ""; // Clear existing content
  
    Object.entries(demographics).forEach(([key, value]) => {
      const row = document.createElement("div");
      row.textContent = `${key}: ${value}`;
      demographicDiv.appendChild(row);
    });
  }

// Function to populate gauge chart with demographic information
function demoGraphic_Info2(metadata) {
  var data = [
      {
          domain: { x: [0, 1], y: [0, 1] },
          value: metadata.wfreq,
          title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
              axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
              bar: { color: "darkblue" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                  { range: [0, 1], color: "rgba(0, 105, 11, .5)" },
                  { range: [1, 2], color: "rgba(10, 120, 22, .5)" },
                  { range: [2, 3], color: "rgba(14, 127, 0, .5)" },
                  { range: [3, 4], color: "rgba(110, 154, 22, .5)" },
                  { range: [4, 5], color: "rgba(170, 202, 42, .5)" },
                  { range: [5, 6], color: "rgba(202, 209, 95, .5)" },
                  { range: [6, 7], color: "rgba(210, 206, 145, .5)" },
                  { range: [7, 8], color: "rgba(232, 226, 202, .5)" },
                  { range: [8, 9], color: "rgba(240, 230, 215, .5)" }
              ],
              threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: metadata.wfreq
              }
          }
      }
  ];

  var layout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
  };

  Plotly.newPlot('Guage', data, layout);
}
