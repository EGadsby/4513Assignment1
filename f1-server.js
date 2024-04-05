const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const cors = require('cors');
app.use(cors());
const supaUrl = 'https://kaagafytrleazdhwecfs.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYWdhZnl0cmxlYXpkaHdlY2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTk3MzMsImV4cCI6MjAyMzA3NTczM30.1Dc2y8oiIcT7LEhgVfs2GhceiHMcfrGENGLXVEmup64';

const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get('/api/circuits', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select();
    res.send(data);
});



app.get('/api/seasons', async (req, res) => {
    const { data, error } = await supabase
        .from('seasons')
        .select();
    res.send(data);
});

app.get('/api/circuits/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select()
        .eq('circuitId', req.params.ref)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }

});

app.get('/api/circuits/info/:circuitid', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select('name, location, country, url')
        .eq('circuitid', req.params.circuitid)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }

});

app.get('/api/circuits/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select('circuits!inner(name)')
        .eq('year', req.params.year)
    console.log(data)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }

});

app.get('/api/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructors')
        .select('*')
    console.log(data)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }

});

app.get('/api/constructors/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('constructors')
        .select('*')
        .eq('constructorRef', req.params.ref)
    console.log(data)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }

});

app.get('/api/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select();
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/drivers/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select()
        .eq('driverRef', [req.params.ref[0].toLowerCase() + req.params.ref.substring(1)])
    console.log([req.params.ref[0].toUpperCase() + req.params.ref.substring(1)])
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/drivers/search/:name', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select(` 
    *
    `)
        .like('surname', [req.params.name[0].toUpperCase() + req.params.name.substring(1) + '%'])
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/drivers/race/:raceid', async (req, res) => {
    const { data, error } = await supabase
        .from('driver_standings')
        .select('drivers!inner(forename,surname)')
        .eq('raceId', req.params.raceid)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }

});

app.get('/api/races/:raceid', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select('*, circuits(circuitId, name, location, country)')
        .eq('raceId', req.params.raceid)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/races/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select('raceId,name,circuitId')
        .eq('year', req.params.year)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/races/season/:year/:round', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select()
        .eq('year', req.params.year)
        .eq('round', req.params.round)

    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/races/circuits/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select('races(name, year)')
        .eq('circuitRef', req.params.ref)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/races/circuits/:ref/season/:start/:end', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select('races(name, year)')
        .eq('circuitRef', req.params.ref)
        .gte('races.year', req.params.start)
        .lte('races.year', req.params.end)
    if (req.params.end < req.params.start) {
        res.status(404).json({ message: "your end date cant be sooner than your start date" });
    }
    else {
        if (data && data.length > 0) {
            res.send(data);
        } else {
            res.status(404).json({ message: "No data found" });
        }
    }
});

app.get('/api/results/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select('drivers!inner(driverRef,code,forename,surname), races!inner(name,round,year,date), constructors(constructorId,name,constructorRef,nationality), grid')
        .eq('raceId', req.params.raceId)
        .order('grid', { ascending: true });
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/drivers/info/:Id', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select('driverId, forename, surname, dob, nationality, url')
        .eq('driverId', req.params.Id)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/results/laps/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select('position, laps, points, drivers!inner(forename,surname), constructors(name,constructorRef,nationality), grid')
        .eq('raceId', req.params.raceId)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/results/driver/:ref', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select('drivers!inner(forename,surname), races!inner(name), grid')
        .eq('drivers.driverRef', req.params.ref)
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/results/driver/:ref/seasons/:start/:end', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select('drivers!inner(forename,surname), races!inner(name,year), grid')
        .eq('drivers.driverRef', req.params.ref)
        .gte('races.year', req.params.start)
        .lte('races.year', req.params.end)
    if (req.params.end < req.params.start) {
        res.status(404).json({ message: "your end date cant be sooner than your start date" });
    }
    else {
        if (data && data.length > 0) {
            res.send(data);
        } else {
            res.status(404).json({ message: "No data found" });
        }
    }
});

app.get('/api/qualifying/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('qualifying')
        .select('* ,drivers!inner(driverRef,code,forename,surname), races!inner(name,round,year,date), constructors(name,constructorRef,nationality)')
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true });
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/standings/drivers/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('driver_standings')
        .select('wins, points, drivers!inner(driverRef,code,forename,surname,dob,url), races!inner(name), position')
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true });
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

app.get('/api/standings/constructors/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('constructor_standings')
        .select('points, wins, constructors!inner(name,constructorRef,nationality,url), races!inner(name), position')
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true });
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.status(404).json({ message: "No data found" });
    }
});

// app.get('/f1/races', async (req, res) => {
//     const { data, error } = await supabase
//         .from('races')
//         .select(` 
//     raceId, year, round, circuitId, name, circuits (name,location,country) 
//     `)
//         .eq('year', 2020)
//         .order('round', { ascending: false });
//     res.send(data);
// });

// app.get('/f1/races/:startyear/:endyear', async (req, res) => {
//     const { data, error } = await supabase
//         .from('races')
//         .select(` 
//     * 
//     `)
//         .gte('year', req.params.startyear)
//         .lte('year', req.params.endyear)
//         .order('year', { ascending: true });
//     res.send(data);
//     console.log(data)
// });

// app.get('/f1/drivers/name/:name/limit/:limit', async (req, res) => {
//     const { data, error } = await supabase
//         .from('drivers')
//         .select(` 
//     surname
//     `)

//         .limit(req.params.limit)
//         .like('surname', [req.params.name[0].toUpperCase() + req.params.name.substring(1) + '%'])
//         .order('surname', { ascending: true });
//     res.send(data);
//     console.log(req.params.name[0].toUpperCase() + req.params.name.substring(1) + '%')
//     console.log(data)
//     console.log(error)
// });

// app.get('/f1/qualifying/:qualify', async (req, res) => {
//     const { data, error } = await supabase
//         .from('qualifying')
//         .select(` 
//     qualifyId, position, q1, q2, q3, races (year, name), 
//     drivers (forename,surname), constructors (name) 
//     `)
//         .eq('qualifyId', req.params.qualify)
//         .order('position', { ascending: true });
//     res.send(data);
//     console.log(data)
// });


// app.get('/f1/results/:race', async (req, res) => {
//     const { data, error } = await supabase
//         .from('results')
//         .select(` 
//     resultId, positionOrder, races (year, name), 
//     drivers (forename,surname), constructors (name) 
//     `)
//         .eq('raceId', req.params.race)
//         .order('positionOrder', { ascending: true });
//     res.send(data);
// });

app.listen(8080, () => {
    console.log('listening on port 8080');
}); 
