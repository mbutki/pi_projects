function SensorHeader({ tab, onClick }: { tab: string, onClick: (tabName: string) => void }) {
    return (
        <div className='large-button'>
            <button onClick={() => { onClick('live') }} className={tab === 'live' ? 'active' : ''}>Live</button>
            <button onClick={() => { onClick('errors') }} className={tab === 'errors' ? 'active' : ''}>Errors</button>
            <button onClick={() => { onClick('graphs') }} className={tab === 'graphs' ? 'active' : ''}>Graphs</button>
        </div>
    )
}

export default SensorHeader
