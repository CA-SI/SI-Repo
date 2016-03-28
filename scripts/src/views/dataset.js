import $ from 'jquery'
import 'select2'
import 'jquery-serializejson'

import {queryByHook} from '../util'

export default function (opts) {
  opts || (opts = {})
  const elements = {
    form: queryByHook('dataset-form', opts.el),
    editButton: queryByHook('edit-button', opts.el),
    cancelButton: queryByHook('cancel-button', opts.el),
    deleteButton: queryByHook('delete-button', opts.el),
    resourceRows: queryByHook('resource-rows', opts.el),
    addResourceButton: queryByHook('add-resource', opts.el),
    alert: queryByHook('alert', opts.el),
    commitUrl: queryByHook('commit-url', opts.el),
    readView: queryByHook('read-view', opts.el),
    editView: queryByHook('edit-view', opts.el),
    select2: $('.select2', opts.el)
  }

  const TmplResourceRow = queryByHook('tmpl-resource-row').html()

  // Initialize select2 plugin
  elements.select2.select2()

  // Edit/Cancel buttons toggle read/edit views
  elements.editButton.add(elements.cancelButton).on('click', (e) => {
    switchView()
    e.preventDefault()
  })

  // "Remove resource" buttons
  elements.resourceRows.on('click', '[data-hook~=remove-resource]', (e) => {
    if (window.confirm('Delete this resource?')) {
      $(e.currentTarget).closest('[data-hook~=resource-row]').remove()
    }
    e.preventDefault()
  })

  // Add resource button
  elements.addResourceButton.on('click', function (e) {
    elements.resourceRows.append(TmplResourceRow)
  })

  // Edit form submission
  elements.form.on('submit', function (e) {
    const formData = elements.form.serializeJSON({useIntKeysAsArrayIndex: true})
    const yaml = opts.file.formatFrontMatter(formData)
    opts.file.save(yaml)
    .then((response) => {
      switchView()
      alert('success', response.commit.html_url)
    }).catch((msg) => {
      alert('error')
      console.error(msg)
    })
    e.preventDefault()
  })

  // Delete dataset button
  elements.deleteButton.on('click', function (e) {
    if (window.confirm('Delete this dataset?')) {
      opts.file.remove()
      .then((response) => {
        alert('success', response.commit.html_url)
      }).catch((msg) => {
        alert('error')
        console.error(msg)
      })
    }
    e.preventDefault()
  })

  function switchView () {
    elements.readView.add(elements.editView).toggle()
  }

  // Show alert box on page
  function alert (type, commitUrl) {
    elements.alert.hide()
    $('[data-hook~=alert-' + type +']').show()
    if (type === 'success' && commitUrl) {
      elements.commitUrl.attr('href', commitUrl)
    }
  }
}
