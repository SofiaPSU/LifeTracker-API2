\echo 'Delete and recreate lifetracker db?'
\prompt 'Return for yes or control-c to cancel > ' answer

DROP DATABASE lifetracker;
CREATE DATABASE lifetracker;
\connect lifetracker

\i 'C:/Users/sofia/LifeTrackerApp/life-api/lifetracker-schema.sql'