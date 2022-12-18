import React, { Component } from 'react'

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hasError: false
        }
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true
        }
    }
    render() {
        if (this.state.hasError) {
            return <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                alignContent: 'center',
                flexWrap: 'nowrap',
                height: '70vh',
            }}>
                <div className="alert alert-danger" role="alert">
                    Something went wrong! Please contact to your site administrator or come back later and try again
                </div>
            </div>
        }
        return this.props.children
    }
}

export default ErrorBoundary
