// 1) D3.js'i import et
importScripts('https://d3js.org/d3.v6.min.js');

// 2) DSCC yardımcı kütüphanesi
const dscc = window.dscc || require('@google/dscc');

// 3) Çizim fonksiyonu
function drawViz(vizData) {
  const table = vizData.tables.DEFAULT; // her satır: [Day, Hour, Transactions]
  const width  = dscc.getWidth();
  const height = dscc.getHeight();
  const margin = { top: 40, right: 20, bottom: 20, left: 50 };

  // Boş SVG ve container'ı temizle
  d3.select('#container').selectAll('*').remove();
  const svg = d3.select('#container')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

  // 1) Veri -> {day, hour, value} listesi
  const data = table.map(r => ({
    day:   r[0],            // örn. "Monday"
    hour:  +r[1],           // 0–23
    value: +r[2]            // transaction sayısı
  }));

  // 2) Gün sıralaması
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  // 3) Ölçekler
  const xScale = d3.scaleBand()
                   .domain(days)
                   .range([margin.left, width - margin.right])
                   .padding(0.05);

  const yScale = d3.scaleBand()
                   .domain(d3.range(0,24))
                   .range([margin.top, height - margin.bottom])
                   .padding(0.05);

  const maxVal = d3.max(data, d => d.value);
  const colorScale = d3.scaleSequential(d3.interpolateReds)
                       .domain([0, maxVal]);

  // 4) Hücreleri çiz
  svg.selectAll('rect')
     .data(data)
     .enter()
     .append('rect')
       .attr('x', d => xScale(d.day))
       .attr('y', d => yScale(d.hour))
       .attr('width',  xScale.bandwidth())
       .attr('height', yScale.bandwidth())
       .attr('fill',   d => colorScale(d.value));

  // 5) Ekseni çiz
  const xAxis = d3.axisTop(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(d => d.toString().padStart(2,'0'));

  svg.append('g')
     .attr('class','axis')
     .attr('transform', `translate(0,${margin.top})`)
     .call(xAxis);

  svg.append('g')
     .attr('class','axis')
     .attr('transform', `translate(${margin.left},0)`)
     .call(yAxis);
}

// 6) Veri değiştiğinde drawViz’i çağır
dscc.subscribeToData(drawViz);
