const toolBox = {
  show: true,
  orient: 'vertical',
  left: '2%',
  top: 'middle',
  itemGap: 20,
  feature: {
    mark: { show: true },
    dataView: { show: true, readOnly: false },
    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
    restore: { show: true },
    saveAsImage: { show: true }
  }
}

const pieLegend = {
  type: "scroll",
  orient: "vertical",
  right: 10,
  top: 20,
  bottom: 20,
  data: []
}

export default {
  all: {
    toolBox,
  },
  pie: {
    legend: pieLegend
  }
}