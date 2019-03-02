import React, { Component } from 'react';
import d3 from 'd3';

export function visualize(candidates, { domain, photoBasePath }) {
  var results = Object.keys(candidates).map((key) => candidates[key]);
  var sorted = results.sort(function(a, b){return b.votes-a.votes})
  sorted.forEach((c, index) => { c.place = index + 1; });
  var x = d3.scale.linear()
      .domain([0, d3.max(results.map((c) => c.votes))])
      .range([0, 500]);

  var row = d3.select(".chart")
    .append("table")
      .selectAll("tr.data")
          .data(sorted)
      .enter()
          .append("tr")
          .attr("class", "datarow");

  row.append("td").text((c) => c.place);
  row.append("td").append("img").attr("src", function(c) {
    return photoBasePath + c.info.photo;
  });
  var info = row.append("td");
  info.style("width", function(c) { return "100px"; });
  info.append("p")
    .text(function(c) { return c.info.name });
  info.append("p")
    .text(function(c) { return c.info.org });
  info.append("p").append("a")
    .text(function(c) { return c.info.site })
    .attr("href", (c) => c.info.site);
  info.append("p").append("a")
    .text(function(c) { return "профайл у соцмережі"; })
    .attr("href", (c) => c.info.social);
  row.append("td")
    .append("div")
    .style("width", function(c) { console.log(c);return x(c.votes) + "px"; })
    .text(function(c) { return c.votes });
}


export class TableChart extends Component {
  componentDidMount() {
    visualize(this.props.data, this.props.meta);
  }

  componentWillReceiveProps(nextProps) {
    visualize(nextProps.data, nextProps.meta);
  }

  render(props) {
    return <div className="chart"></div>;
  }
}
