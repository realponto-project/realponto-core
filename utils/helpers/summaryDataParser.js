const { sort } = require('ramda')
const diff = function(a, b) { return new Date(a.name) - new Date(b.name)  }

const parserSummaryData = values => sort(diff, values
  .map(item => ({ ...item, name: item.name.toString() }))
  .reduce((curr, prev) => {
  if(curr.length === 0) {
    curr = [{
      name: prev.name,
      [prev['status.label']]: prev.count,
    }]
  }

  if(curr.length > 0) {
    const findSummary = curr.find(summary => summary.name === prev.name)
    if (findSummary) {
      curr = curr.map(item =>
        item.name === prev.name
          ? ({
              ...item,
              [prev['status.label']]: prev.count,
            })
          : item
      )
    }
    else {
      curr = [
        ...curr,
        {
          name: prev.name,
          [prev['status.label']]: prev.count,
        }
      ]
    }
  }

  return curr
}, []))

const getStatusSummary = values => values.reduce((curr, prev) => {
  if(curr.length === 0) {
    curr = [{
      color: prev['status.color'],
      label: prev['status.label'],
      value: prev['status.value'],
    }]
  }

  if(curr.length > 0) {
    const findSummary = curr.find(summary => summary.color === prev['status.color'])
    if (!findSummary) {
      curr = [
        ...curr,
        {
          color: prev['status.color'],
          label: prev['status.label'],
          value: prev['status.value'],
        }
      ]
    }
  }

  return curr
}, [])

module.exports = {
  parserSummaryData,
  getStatusSummary,
}
