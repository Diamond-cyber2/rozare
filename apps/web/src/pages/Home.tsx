import React from 'react';
import Landing from '../components/Landing';

type Props = { dark?: boolean };

const Home: React.FC<Props> = () => {
    return (
        <main>
            <Landing />
        </main>
    );
};

export default Home;