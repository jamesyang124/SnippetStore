import { observable, computed } from 'mobx'
import SnippetAPI from 'core/API/snippet'
import searchSnippet from 'core/API/search-snippet'
import sortSnippet from 'core/API/sort-snippet'

class SnippetStore {
  @observable rawSnippets = []
  @observable filter = ''
  @observable sort = 'createTimeNewer'

  @computed get snippets () {
    let snippets = searchSnippet(this.rawSnippets, this.filter)
    return sortSnippet(snippets, this.sort)
  }

  @computed get languages () {
    const languages = {}
    this.rawSnippets.forEach(snippet => {
      if (languages[snippet.lang]) {
        languages[snippet.lang] += 1
      } else {
        languages[snippet.lang] = 1
      }
    })
    return languages
  }

  @computed get tags () {
    const tags = {}
    this.rawSnippets.forEach(snippet => {
      snippet.tags.filter(tag => tag).forEach(tag => {
        if (tags[tag]) {
          tags[tag] += 1
        } else {
          tags[tag] = 1
        }
      })
    })
    return tags
  }

  loadSnippets (snippets) {
    this.rawSnippets = snippets
  }

  createSnippet (snippet) {
    const newSnippet = SnippetAPI.createSnippet(snippet)
    this.rawSnippets.push(newSnippet)
  }

  updateSnippet (snippet) {
    // update using the snippet API
    const snippetIndex = SnippetAPI.updateSnippet(snippet)
    this.rawSnippets[snippetIndex] = snippet
  }

  increaseCopyTime (snippet) {
    snippet.copy += 1
    this.updateSnippet(snippet)
  }

  deleteSnippet (snippet) {
    const snippetIndex = SnippetAPI.deleteSnippet(snippet)
    this.rawSnippets.splice(snippetIndex, 1)
  }
}

let store = window.store = new SnippetStore()

export default store
