# Hospital Management System
This is our final project for CPSC 471 - Database Management Systems.
Current work in progress. Authors: Manraj Singh, Gustavo Bravo, Sajan Hayer

### How to install
After cloning/downloading the repository, change directiories into the ``client`` directory.
In this directory, run the following command ``npm install``. Once the packages have been installed,
you can open the Vite ReactJS frontend at ``http://localhost:8000/``.

Now change directories into the ``server`` directory and run the following command again ``npm install``.
After the packages are installed, run the ``npm run dev`` command again to run the ExpressJS server.

### How to setup the MySQL database:

This assumes that you are able to run a MySQL server on your machine locally. Once you have created a MySQL local instance called ``hospitaldatabase``
you can run the ``HospitalDBCreateTables.sql`` file included in the ``databasefiles`` directory in the ``server`` folder. 
This will create all of the necessary tables that are required to use the web-app. After this is complete, use the ``NewInsertStatements.sql`` file to 
insert dummy data into the tables. Once the data has been inserted, connect to the database by adding your own ``user`` and ``password`` fields in the 
``database.js`` file (near the top of the file - it has been labelled with comments for clarity).

