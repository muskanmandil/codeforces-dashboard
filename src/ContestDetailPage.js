import React, { useState, useEffect } from 'react';
import {
    Page,
    Card,
    Text,
    Button,
    ButtonGroup,
    Link,
    Badge,
    Icon
} from '@shopify/polaris';
import {
    CalendarIcon,
    ClockIcon,
    CodeIcon,
    ArrowLeftIcon
} from '@shopify/polaris-icons';
import { useParams, useNavigate } from 'react-router-dom';

const ContestDetailPage = ({ contests }) => {



    const { contestId } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);

    useEffect(() => {
        console.log('Contests:', contests);
        const id = parseInt(contestId, 10);
        const selectedContest = contests.find(c => c.id === id);
        setContest(selectedContest);
    }, [contestId, contests]);



    if (!contest) {
        return (
            <Page
                title="Contest Not Found"
                primaryAction={{
                    content: 'Back to Contests',
                    onAction: () => navigate('/')
                }}
            >
                <Text variant="bodyMd">The requested contest could not be found.</Text>
            </Page>
        );
    }

    // Helper function to format details consistently
    const formatContestDetail = (label, value, icon) => (
        <div className="flex items-center gap-3">
            <Icon source={icon} tone="magic" />
            <div>
                <Text variant="bodyMd" fontWeight="bold">{label}</Text>
                <Text variant="bodyMd">{value}</Text>
            </div>
        </div>
    );

    // Format phase with color-coded badge
    const getPhaseBadge = (phase) => {
        switch (phase) {
            case 'BEFORE':
                return <Badge tone="info">Upcoming</Badge>;
            case 'CODING':
                return <Badge tone="success">Live</Badge>;
            case 'FINISHED':
                return <Badge tone="warning">Completed</Badge>;
            default:
                return <Badge>{phase}</Badge>;
        }
    };

    // Format duration
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours} hours ${minutes !== 0 ? `${minutes} minutes` : ''}`;
    };

    // Format date with local time
    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString('en-IN', {
            dateStyle: 'full',
            timeStyle: 'long',
        });
    };

    try {
        return (
            <Page title={contest.name} primaryAction={{
                content: 'Back to Contests',
                icon: ArrowLeftIcon,
                onAction: () => navigate('/')
            }}>
                <div className="space-y-4">
                    <Card>
                        <div className="flex justify-between items-center">
                            <Text variant="headingMd" as="h2">
                                Contest Details
                            </Text>
                            {getPhaseBadge(contest.phase)}
                        </div>

                        {formatContestDetail('Contest Name', contest.name, CodeIcon)}
                        {formatContestDetail('Contest Type', contest.type, ClockIcon)}
                        {formatContestDetail('Start Time', formatDate(contest.startTimeSeconds), CalendarIcon)}

                        <div className="flex items-center gap-3">
                            <Icon source={ClockIcon} tone="magic" />
                            <div>
                                <Text variant="bodyMd" fontWeight="bold">Duration</Text>
                                <Text variant="bodyMd">{formatDuration(contest.durationSeconds)}</Text>
                            </div>
                        </div>

                        {/* Optional Additional Section */}
                        <ButtonGroup>
                            <Link
                                url={`https://codeforces.com/contests/${contest.id}`}
                                external
                            >
                                <Button primary>
                                    View on Codeforces
                                </Button>
                            </Link>
                        </ButtonGroup>
                    </Card>
                </div>
            </Page>
        );
    } catch (error) {
        console.error('Error rendering ContestDetailPage:', error);
        return <Text variant="bodyMd">Error loading contest details.</Text>;
    }
};

export default ContestDetailPage;