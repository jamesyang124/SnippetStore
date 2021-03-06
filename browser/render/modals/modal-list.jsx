import React from 'react'
import CreateSnippetModal from './create-snippet'
import CreateMultiFilesSnippetModal from './create-multi-files-snippet'
import PickSnippetType from './pick-snippet-type'
import SettingModal from './setting'
import eventEmitter from 'lib/event-emitter'
import { inject } from 'mobx-react'

@inject('store')
export default class ModalList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: '',
      data: {}
    }
  }

  componentDidMount () {
    eventEmitter.on('modal:open', (event, modalName) => {
      this.setState({ modal: modalName })
    })

    eventEmitter.on('modal:close', () => {
      this.setState({ modal: '' })
    })

    eventEmitter.on('modal:openWithData', (event, data) => {
      this.setState({ modal: data.name, data: data.data })
    })
  }

  render () {
    const { config, store } = this.props
    const { modal, data } = this.state
    switch (modal) {
      case 'pickSnippetTypeModal':
        return <PickSnippetType config={config} store={store} />
      case 'createSnippetModal':
        return <CreateSnippetModal config={config} store={store} data={data} />
      case 'createMultiFilesSnippetModal':
        return <CreateMultiFilesSnippetModal config={config} store={store} />
      case 'settingModal':
        return <SettingModal config={config} store={store} />
      default:
        return ''
    }
  }
}
