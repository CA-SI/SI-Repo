/**
 * Usage:
 * <div data-component="disciplinas-list">
 *   <h3 class="disciplinas-count" data-hook="disciplinas-count"></h3>
 *   <input type="text" data-hook="search-query" placeholder="Search..." class="form-control">
 *   <div data-hook="disciplinas-items"></div>
 * </div>
 *
 * Optionally, add filters to the component element such as
 *   data-teacher="sample-department"
 *   data-category="education"
 */
import {pick, defaults, filter} from 'lodash'

import TmplDisciplinaItem from '../templates/disciplina-item'
import {queryByHook, setContent, createDisciplinaFilters} from '../util'

export default class {
  constructor (opts) {
    const elements = {
      disciplinasItems: queryByHook('disciplinas-items', opts.el),
      disciplinasCount: queryByHook('disciplinas-count', opts.el),
      searchQuery: queryByHook('search-query', opts.el)
    }

    // Filter disciplinas and render in items container
    const paramFilters = pick(opts.params, ['teacher', 'category'])
    const attributeFilters = pick(opts.el.data(), ['teacher', 'category'])
    const filters = createDisciplinaFilters(defaults(paramFilters, attributeFilters))
    const filteredDisciplinas = filter(opts.disciplinas, filters)
    const disciplinasMarkup = filteredDisciplinas.map(TmplDisciplinaItem)
    setContent(elements.disciplinasItems, disciplinasMarkup)

    // // Disciplina count
    const disciplinaSuffix =  filteredDisciplinas.length > 1 ? 's' : ''
    const disciplinasCountMarkup = filteredDisciplinas.length + ' disciplina' + disciplinaSuffix;
    setContent(elements.disciplinasCount, disciplinasCountMarkup)

    // Search disciplinas listener
    const searchFunction = this._createSearchFunction(filteredDisciplinas)
    elements.searchQuery.on('keyup', (e) => {
      const query = e.currentTarget.value

      // Disciplinas
      const results = searchFunction(query)
      const resultsMarkup = results.map(TmplDisciplinaItem)
      setContent(elements.disciplinasItems, resultsMarkup)

      // Disciplina count
      const resultsCountMarkup = results.length + ' disciplinas'
      setContent(elements.disciplinasCount, resultsCountMarkup)
    })
  }

  // Returns a function that can be used to search an array of disciplinas
  // The function returns the filtered array of disciplinas
  _createSearchFunction (disciplinas) {
    const keys = ['title', 'notes']
    return function (query) {
      const lowerCaseQuery = query.toLowerCase()
      return filter(disciplinas, function (disciplina) {
        return keys.reduce(function (previousValue, key) {
          return previousValue || (disciplina[key] && disciplina[key].toLowerCase().indexOf(lowerCaseQuery) !== -1)
        }, false)
      })
    }
  }
}
