d3.csv("./data/SgNumbers.csv").then(function(data) {

    data.forEach(function(d) {
        let category;
        if(+d.AirQuality<50 && d.WaterPollution>50) {
            category = "worstCities"; 
        } else if (+d.AirQuality>50 && d.WaterPollution<50) {
            category = "bestCities";
        } else {
            category = "moderateCities";
        }
        d.category = category;
    });

    console.log(data);

    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 50, left: 100, right: 50, bottom: 150};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    console.log(data);

    /* Create sets of filtered data for worst, best, and moderate pollution levels */

    const filtered_worst = data.filter(function(d) {
        return (d.category == 'worstCities'); 
    });

    console.log(filtered_worst);

    const filtered_best = data.filter(function(d) {
        return (d.category == 'bestCities');
    });

    console.log(filtered_best);

    const filtered_moderate = data.filter(function(d) {
        return (d.category == 'moderateCities');
    });

    console.log(filtered_moderate);

    /* Determine min and max values */

    let AirQuality = {
        minWorst: d3.min(filtered_worst, function(d) {return +d.AirQuality;}),
        maxWorst: d3.max(filtered_worst, function(d) {return +d.AirQuality;}),
        minBest: d3.min(filtered_best, function(d) {return +d.AirQuality;}),
        maxBest: d3.max(filtered_best, function(d) {return +d.AirQuality;}),
        minModerate: d3.min(filtered_moderate, function(d) {return +d.AirQuality;}),
        maxModerate: d3.max(filtered_moderate, function(d) {return +d.AirQuality;})
    }

    let WaterPollution = {
        minWorst: d3.min(filtered_worst, function(d) {return +d.WaterPollution;}),
        maxWorst: d3.max(filtered_worst, function(d) {return +d.WaterPollution;}),
        minBest: d3.min(filtered_best, function(d) {return +d.WaterPollution;}),
        maxBest: d3.max(filtered_best, function(d) {return +d.WaterPollution;}),
        minModerate: d3.min(filtered_moderate, function(d) {return +d.WaterPollution;}),
        maxModerate: d3.max(filtered_moderate, function(d) {return +d.WaterPollution;})
    }

    /*
    CREATE SCALES

    Use the computed min and max values to create scales for
    our scatter plot:

    `xScale` will convert Air Quality to horizontal position;

    `yScale` will convert Water Pollution to vertical position;

    */

    const xScale = d3.scaleLinear()
        .domain([AirQuality.minWorst, AirQuality.maxWorst])
        .range([margin.left, width-margin.right]); 

    const yScale = d3.scaleLinear()
        .domain([WaterPollution.minWorst, WaterPollution.maxWorst])
        .range([height-margin.bottom, margin.top]); 

    /* Draw Axes */

    const xAxis = svg.append("g")
    .attr("class","axis")
    .attr("transform", `translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom().scale(xScale));

    const yAxis = svg.append("g")
    .attr("class","axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft().scale(yScale));

    /* Draw points */

    let points = svg.selectAll("circle")
    .data(filtered_worst, function(d) { return d.category; })
    .enter()
    .append("circle")
        .attr("cx", function(d) {return xScale(d.AirQuality ); })
        .attr("cy", function(d) {return yScale(d.WaterPollution); })
        .attr("r", 8)   
        .attr("fill", "#D31B0D")
        .attr("opacity", 0.2);


    /* AXES LABELS */

    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2 + 25)
        .attr("y", height - 100)
        .attr("text-anchor","middle")
        .text("Air Quality");

    const xAxisLeft = svg.append("text")
        .attr("class","axisScale")
        .attr("x", width/2 - 700)
        .attr("y", height - 100)
        .attr("text-anchor","middle")
        .text("Worst Quality");

    const xAxisRight = svg.append("text")
        .attr("class","axisScale")
        .attr("x", width/2 + 750)
        .attr("y", height - 100)
        .attr("text-anchor","middle")
        .text("Best Quality");

    const yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", -height/2 + 45)
        .attr("y", 50)
        .attr("text-anchor","middle")
        .attr("transform","rotate(-90)")
        .text("Water Pollution");

    const yAxisBottom = svg.append("text")
        .attr("class","axisScale")
        .attr("x", -height/2 - 250)
        .attr("y", 50)
        .attr("text-anchor","middle")
        .attr("transform","rotate(-90)")
        .text("Best Quality");

    const yAxisTop = svg.append("text")
        .attr("class","axisScale")
        .attr("x", -height/2 + 350)
        .attr("y", 50)
        .attr("text-anchor","middle")
        .attr("transform","rotate(-90)")
        .text("Worst Quality");

    /*TOOLTIP*/ 

    let tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip");

    svg.selectAll("circle").on("mouseover", function (e,d) {

        let cx = +d3.select(this).attr("cx");
        let cy = +d3.select(this).attr("cy");

        tooltip.style("visibility", "visible")
        .style("left", `${cx}px`)
        .style("top", `${cy}px`)
        .html(`<b>City</b>: ${d.City}<br> <b>Region</b>: ${d.Region}<br> <b>Country</b>: ${d.Country}`);

        d3.select(this)
            .attr("stroke", "#38062B")
            .attr("stroke-width", 5);

    }).on("mouseout", function (){

        tooltip.style("visibility", "hidden");

        d3.select(this)
            .attr("stroke", "none")
            .attr("stroke-width", 0);
        });

        /* 
        UPDATE DATA, WITH TRANSITION
        */

        /* worst cities */ 

        d3.select("#worstCities").on("click", function() {

            xScale.domain([AirQuality.minWorst, AirQuality.maxWorst]);
            yScale.domain([WaterPollution.minWorst, WaterPollution.maxWorst]);

            let enterPoints = svg.selectAll("circle")
                .data(filtered_worst, function(d) {return d.category; });

            enterPoints.enter()
                .append("circle")
                .attr("cx", function(d) {return xScale(d.AirQuality); })
                .attr("cy", function(d) {return yScale(d.WaterPollution); })
                .attr("r", 8)   
                .attr("fill", "#D31B0D")
                .attr("opacity", 0.2)
            .merge(enterPoints)
                .transition()
                .duration(2000)
                .attr("cx", function(d) {return xScale(d.AirQuality); })
                .attr("cy", function(d) {return yScale(d.WaterPollution); })
                .attr("r", 8)   
                .attr("fill", "#D31B0D")
                .attr("opacity", 0.2)

            enterPoints.exit()
                .transition()
                .duration(2000)
                .attr("r", 0)
                .remove(); 

            xAxis.transition()
                .duration(2000)
                .call(d3.axisBottom().scale(xScale));

            yAxis.transition()
                .duration(2000)
                .call(d3.axisLeft().scale(yScale));

            /* update tooltip for worst cities */
                
            let tooltip = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip");

            svg.selectAll("circle").on("mouseover", function (e,d) {

            let cx = +d3.select(this).attr("cx");
            let cy = +d3.select(this).attr("cy");

            tooltip.style("visibility", "visible")
                .style("left", `${cx}px`)
                .style("top", `${cy}px`)
                .html(`<b>City</b>: ${d.City}<br> <b>Region</b>: ${d.Region}<br> <b>Country</b>: ${d.Country}`);

            d3.select(this)
                .attr("stroke", "#38062B")
                .attr("stroke-width", 5);

            }).on("mouseout", function (){

            tooltip.style("visibility", "hidden");

            d3.select(this)
                .attr("stroke", "none")
                .attr("stroke-width", 0);
            });

        });

        /* best cities */

        d3.select("#bestCities").on("click", function() {

            xScale.domain([AirQuality.minBest, AirQuality.maxBest]);
            yScale.domain([WaterPollution.minBest, WaterPollution.maxBest]);

            let enterPoints = svg.selectAll("circle")
                .data(filtered_best, function(d) { return d.category; });
                
            enterPoints.enter()
                .append("circle")
                .attr("cx", function(d) {return xScale(d.AirQuality); })
                .attr("cy", function(d) {return yScale(d.WaterPollution); })
                .attr("r", 8)   
                .attr("fill", "#79c153")
                .attr("opacity", 0.2)
            .merge(enterPoints)
                .transition()
                .duration(2000)
                .attr("cx", function(d) {return xScale(d.AirQuality); })
                .attr("cy", function(d) {return yScale(d.WaterPollution); })
                .attr("r", 8)   
                .attr("fill", "#79c153")
                .attr("opacity", 0.2)

            enterPoints.exit()
                .transition()
                .duration(2000)
                .attr("r", 0)
                .remove();

            xAxis.transition()
                .duration(2000)
                .call(d3.axisBottom().scale(xScale));

            yAxis.transition()
                .duration(2000)
                .call(d3.axisLeft().scale(yScale));

            /* update tooltip for best cities */

            let tooltip = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip");

            svg.selectAll("circle").on("mouseover", function (e,d) {

            let cx = +d3.select(this).attr("cx");
            let cy = +d3.select(this).attr("cy");

            tooltip.style("visibility", "visible")
                .style("left", `${cx}px`)
                .style("top", `${cy}px`)
                .html(`<b>City</b>: ${d.City}<br> <b>Region</b>: ${d.Region}<br> <b>Country</b>: ${d.Country}`);

            d3.select(this)
                .attr("stroke", "#38062B")
                .attr("stroke-width", 5);

            }).on("mouseout", function (){

            tooltip.style("visibility", "hidden");

            d3.select(this)
                .attr("stroke", "none")
                .attr("stroke-width", 0);
            });

        });

        /* moderate cities */

        d3.select("#moderateCities").on("click", function() {

            xScale.domain([AirQuality.minModerate, AirQuality.maxModerate]);
            yScale.domain([WaterPollution.minModerate, WaterPollution.maxModerate]);

            let enterPoints = svg.selectAll("circle")
                .data(filtered_moderate, function(d) { return d.category; });
                
            enterPoints.enter()
                .append("circle")
                .attr("cx", function(d) {return xScale(d.AirQuality); })
                .attr("cy", function(d) {return yScale(d.WaterPollution); })
                .attr("r", 8)   
                .attr("fill", "#a48443")
                .attr("opacity", 0.2)
            .merge(enterPoints)
                .transition()
                .duration(2000)
                .attr("cx", function(d) {return xScale(d.AirQuality); })
                .attr("cy", function(d) {return yScale(d.WaterPollution); })
                .attr("r", 8)   
                .attr("fill", "#a48443")
                .attr("opacity", 0.2)

            enterPoints.exit()
                .transition()
                .duration(2000)
                .attr("r", 0)
                .remove();

            xAxis.transition()
                .duration(2000)
                .call(d3.axisBottom().scale(xScale));

            yAxis.transition()
                .duration(2000)
                .call(d3.axisLeft().scale(yScale));

            /* update tooltip for moderate cities */

            let tooltip = d3.select("#chart")
                .append("div")
                .attr("class", "tooltip");

            svg.selectAll("circle").on("mouseover", function (e,d) {

            let cx = +d3.select(this).attr("cx");
            let cy = +d3.select(this).attr("cy");

            tooltip.style("visibility", "visible")
                .style("left", `${cx}px`)
                .style("top", `${cy}px`)
                .html(`<b>City</b>: ${d.City}<br> <b>Region</b>: ${d.Region}<br> <b>Country</b>: ${d.Country}`);

            d3.select(this)
                .attr("stroke", "#38062B")
                .attr("stroke-width", 5);

            }).on("mouseout", function (){

            tooltip.style("visibility", "hidden");

            d3.select(this)
                .attr("stroke", "none")
                .attr("stroke-width", 0);
            });
            
        });

});

