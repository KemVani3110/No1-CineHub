'use client';

import React from 'react';
import TVShowList from './TVShowList';

const UpcomingTVShows = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Upcoming Releases</h2>
      <TVShowList listType="on_the_air" />
    </section>
  );
};

export default UpcomingTVShows; 