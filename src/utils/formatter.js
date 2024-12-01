const formatPhase = (phase) => {
    switch (phase) {
        case 'BEFORE':
            return 'Upcoming';

        case 'CODING':
            return 'Live';

        case 'FINISHED':
            return 'Completed'
    }
}

const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hours ${minutes !== 0 ? `${minutes} minutes` : ''}`;
};

const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

module.exports = { formatPhase, formatDuration, formatDate }