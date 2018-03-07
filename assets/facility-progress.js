function drawDiamond() {

  let goal = 85000;
  let amount = 40970;
  let dim = 250;
  let margin = 20;
  let baseSize = 20;

  let svgContainer = d3.select("#divStatusDiamond").append("svg")
  .attr("width", dim)
  .attr("height", dim);

  svgContainer.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "#339933");

  // bottom / left / top / right

  let basePath = [
    [dim/2, dim-margin],
    [margin, dim/2],
    [dim/2, margin],
    [dim-margin, dim/2],
  ];

  appendPolygon(svgContainer, basePath, "4", "#ffffff");

  let baseDiamonds = [
    basePath[1],
    [basePath[2][0] - baseSize/2, basePath[2][1] + baseSize/2],
    [basePath[3][0] - baseSize, basePath[3][1]]
  ];

  baseDiamonds.forEach(function(v) {
    let baseDiamond = getBaseVertices(v[0], v[1], 20);
    appendPolygon(svgContainer, baseDiamond, "3", "#ffffff");
  });

  let homePlate = [
    [dim/2, dim-margin],
    [dim/2 - baseSize/2, dim - margin - baseSize/2],
    [dim/2 - baseSize/2, dim - margin - baseSize],
    [dim/2 + baseSize/2, dim - margin - baseSize],
    [dim/2 + baseSize/2, dim - margin - baseSize/2]
  ];

  appendPolygon(svgContainer, homePlate, "3", "#ffffff");

  let quarters = Math.floor(amount / (goal/4));
  let lastQuarter = amount % (goal/4);
  let basePathLength = Math.sqrt(2*(dim/2 - margin)**2);

  let bumpFactor = 2;

  let bump = function(p, x, y) {
    return [p[0] + x*bumpFactor, p[1] + y*bumpFactor];
  }

  let basePathLines = [
    [bump(basePath[0], -1, 1), bump(basePath[3], 1, -1)],
    [bump(basePath[3], 1, 1), bump(basePath[2], -1, -1)],
    [bump(basePath[2], 1, -1), bump(basePath[1], -1, 1)],
    [bump(basePath[1], -1, -1), bump(basePath[0], 1, 1)]
  ]

  // full quarter = achieving a whole base
  for (let i=0;i < quarters; i++) {
    appendProgressLine(svgContainer, basePathLines[i][0], basePathLines[i][1]);
  }

  // direction in which p1 is, relative to p0, for each base path
  let quarterDirections = [
    [1, -1],
    [-1, -1],
    [-1, 1],
    [1, 1]
  ]

  // last quarter - partial base
  if (quarters < 4) {

    let bplStart = basePathLines[quarters][0];
    lastQuarter = lastQuarter*basePathLength*4/goal; // line length
    let bplEnd = [];

    bplEnd[0] = Number.parseFloat(bplStart[0]) + quarterDirections[quarters][0]*(lastQuarter*Math.sqrt(2)/2);
    bplEnd[1] = Number.parseFloat(bplStart[1]) + quarterDirections[quarters][1]*(lastQuarter*Math.sqrt(2)/2);

    appendProgressLine(svgContainer, bplStart, bplEnd);

    let ballRadius = 9;

    let appendBallTo = function(parentElement) {
      parentElement.append("circle")
      .attr("cx", bplEnd[0])
      .attr("cy", bplEnd[1])
      .attr("r", ballRadius)
      return parentElement;
    };

    appendBallTo(svgContainer)
    .attr("fill", "#ffffff")
    .attr("stroke", "#13326d");

    let clip = svgContainer.append("clipPath")
    .attr("id", "ball-clip");

    appendBallTo(clip);

    let laces = function(direction) {
      svgContainer.append("circle")
      .attr("cx", bplEnd[0] + direction*(ballRadius*1.4))
      .attr("cy", bplEnd[1])
      .attr("r", ballRadius)
      .attr("fill", "#ffffff")
      .attr("fill-opacity", "0.0")
      .attr("stroke", "red")
      .attr("clip-path", "url(#ball-clip)")
    };

    laces(-1);
    laces(1);

  }

  // text in middle

  svgContainer.append("text")
  .attr("x", dim/2)
  .attr("y", dim/2)
  .attr("fill", "#13326d")
  .attr("text-anchor", "middle")
  .attr("font-size", "24")
  .attr("font-weight", "bold")
  .text("$" + amount.toLocaleString())

}

function appendProgressLine(svgContainer, p1, p2) {
  svgContainer.append("line")
  .attr("stroke-width", "7")
  .attr("stroke", "#13326d")
  .attr("x1", p1[0])
  .attr("y1", p1[1])
  .attr("x2", p2[0])
  .attr("y2", p2[1]);
}

function appendPolygon(svgContainer, vertices, strokeWidth, stroke) {
  svgContainer.append("polygon")
  .attr("points",function(d) {
          return vertices.map(function(dd) {
            return dd.join(",");
          }).join(" ");
        })
  .attr("fill", "none")
  .attr("stroke-width", strokeWidth)
  .attr("stroke", stroke);
}

function getBaseVertices(leftCornerX, leftCornerY, baseSize) {

  let halfSize = baseSize/2;

  return [
    [leftCornerX+halfSize, leftCornerY-halfSize],
    [leftCornerX+baseSize, leftCornerY],
    [leftCornerX+halfSize, leftCornerY+halfSize],
    [leftCornerX, leftCornerY],
  ]

}
