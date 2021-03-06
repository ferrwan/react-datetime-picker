// @flow

import React, { Component } from 'react'
import type Moment from 'moment'

import DateTimePicker from './components/date-time-picker'

type Props = {
  showTime?: boolean,
}

type State = {
  dateTimeValue: Moment,
  isActive: boolean,
}

export default class App extends Component<Props, State> {
  static defaultProps = {
    showTime: true,
  }

  state: State = {
    dateTimeValue: null,
    isActive: false,
  }

  focusHandler = () => {
    const { isActive } = this.state
    if (!isActive) {
      document.addEventListener('click', this.clickOutsideHandler, false)
      this.setState({ isActive: true })
    }
  }

  blurHandler = () => {
    document.removeEventListener('click', this.clickOutsideHandler, false)
    this.setState({ isActive: false })
  }

  checkParent = (elm: HTMLElement, className: string) => {
    if (!elm) {
      return false
    } else if (elm && elm.classList.contains(className)) {
      return true
    }
    return this.checkParent(elm.parentElement, className)
  }

  // Handle click event for toggling calendar if isActive
  clickOutsideHandler = (e: SyntheticEvent<HTMLElement>) => {
    if ((this.node && this.node.contains(e.target)) || this.checkParent(e.target, 'week')) return
    this.blurHandler()
  }

  setFormatText = (dateFormat: string = 'DD-MMM-YYYY', timeFormat: string = 'HH:mm:ss') => {
    const { showTime } = this.props
    let format = dateFormat
    if (showTime) {
      format += ` ${timeFormat}`
    }

    return format
  }

  node = {}

  inputNode = {}

  dateTimeHandler = (value: ?string) => {
    this.setState({
      dateTimeValue: value,
    })
  }

  removeBtn = () => {
    const { dateTimeValue } = this.state
    const props = {
      className: 'rm-btn',
      role: 'button',
      onClick: () => this.dateTimeHandler(null),
      onKeyUp: () => this.dateTimeHandler(null),
    }
    const node = dateTimeValue ? <span { ...props } /> : null

    return node
  }

  render() {
    const { dateTimeValue, isActive } = this.state
    const value = dateTimeValue ? dateTimeValue.format(this.setFormatText()) : ''
    return (
      <div id="react-datetime" ref={ (node) => { this.node = node } }>
        <input
          ref={ (n) => { this.inputNode = n } }
          onFocus={ this.focusHandler }
          value={ value }
          readOnly
        />
        { this.removeBtn() }
        {
          isActive && (
            <DateTimePicker
              changeDateTime={ this.dateTimeHandler }
              dateTimeValue={ dateTimeValue }
              inputRef={ this.inputNode }
            />
          )
        }
      </div>
    )
  }
}
