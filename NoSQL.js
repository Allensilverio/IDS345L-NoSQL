//Consultas en Restaurants

//Contar cuántos restaurantes se tiene tipos de cocina en cada sector; ordenados de manera descendente.  
db.restaurants.aggregate([
  {
    $group: {
      _id: {
        borough: "$borough",
        cuisine: "$cuisine"
      },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      borough: "$_id.borough",
      cuisine: "$_id.cuisine",
      count: 1
    }
  },
  {
    $sort: {
      borough: 1,
      count: -1
    }
  }
])


//Extraer el top 5 de restaurantes por puntaje (rating) promedio. 

db.restaurants.aggregate([
  {
    $unwind: "$grades"
  },
  {
    $group: {
      _id: "$name",
      avgScore: { $avg: "$grades.score" }
    }
  },
  {
    $sort: { avgScore: -1 }
  },
  {
    $limit: 5
  }
])


//Los primeros 50 de restaurantes por puntaje (rating) y de acuerdo a su puntaje asociar una calificación de la siguiente forma: A > 20, B > 13, C < 13 . 
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $group: {
      _id: "$restaurant_id",
      avgScore: { $avg: "$grades.score" },
      name: { $first: "$name" }
    }
  },
  {
    $project: {
      _id: 1,
      name: 1,
      avgScore: 1,
      rating: {
        $switch: {
          branches: [
            { case: { $gt: ["$avgScore", 20] }, then: "A" },
            { case: { $gte: ["$avgScore", 13] }, then: "B" },
            { case: { $lt: ["$avgScore", 13] }, then: "C" },
          ],
        },
      },
    },
  },
  { $sort: { avgScore: -1 } },
  { $limit: 50 }
]);






//Extraer el review más antiguo. Nota, la fecha está en formato unix timestamp.
db.restaurantsOpening.aggregate([
  { $unwind: "$reviews" },
  { $sort: { "reviews.date": 1 } },
  { $limit: 1 },
  { $project: { _id: 0, oldestReview: "$reviews" } }
])


//Consultas en Restaurant Opening

//Mostrar los días que cierran, o mostrar Open Everyday si no cierra. 

db.restaurantsOpening.aggregate([
  {
    $project: {
      name: 1,
      closed: {
        $concatArrays: [
          {
            $cond: [{ $eq: ["$operating_hours.Monday", "Closed"] }, ["Monday"], []]
          },
          {
            $cond: [{ $eq: ["$operating_hours.Tuesday", "Closed"] }, ["Tuesday"], []]
          },
          {
            $cond: [{ $eq: ["$operating_hours.Wednesday", "Closed"] }, ["Wednesday"], []]
          },
          {
            $cond: [{ $eq: ["$operating_hours.Thursday", "Closed"] }, ["Thursday"], []]
          },
          {
            $cond: [{ $eq: ["$operating_hours.Friday", "Closed"] }, ["Friday"], []]
          },
          {
            $cond: [{ $eq: ["$operating_hours.Saturday", "Closed"] }, ["Saturday"], []]
          },
          {
            $cond: [{ $eq: ["$operating_hours.Sunday", "Closed"] }, ["Sunday"], []]
          }
        ]
      }
    }
  },
  {
    $project: {
      name: 1,
      closed: {
        $cond: [{ $eq: ["$closed", []] }, "Open Everyday", "$closed"]
      }
    }
  }
])

