// https://voting.nabu.gov.ua/voting/
var s = document.createElement('script');
s.setAttribute('src','https://cdn.jsdelivr.net/npm/table-to-json@0.13.0/lib/jquery.tabletojson.min.js');
document.body.appendChild(s);


getCandidate = (candidate) => {
  let name_with_number = candidate['П.І.Б.']
  let ngo_name = candidate['Громадське об’єднання']
  let id = name_with_number.split('.')[0]
  let name = name_with_number.split('.')[1]
  return {
    id,
    name,
    ngo_name
  }
}
getCandidates = () => {
  var results = $('table').tableToJSON();
  results = results.map(getCandidate)
  return results;
}
candidates = { candidates: getCandidates() };

JSON.stringify(candidates, null, 2)
