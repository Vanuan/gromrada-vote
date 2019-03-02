function parseVotes(body, data) {
  var votes = {};
  var candidates = data.candidates;
  candidates.forEach((candidate) => { votes[candidate.id] = { votes: 0, info: candidate }; });
  var voters = body.split('\n').filter((voter) => voter.trim());
  document.getElementById("voters-count").innerText = voters.length;
  document.getElementById("candidates-count").innerText = Object.keys(candidates).length;
  voters.forEach((voter) => {
    const VOTES_REGEX = /SEL=(\d+(?:,\d+)*)/;
    var vote = voter.match(VOTES_REGEX);
    if(!vote) {
      throw new Error(`Can't find vote info in ${voter}`);
    } else {
      vote[1].split(',').forEach((candidateId) => {
        if(votes[candidateId] !== undefined) {
          votes[candidateId].votes += 1;
        } else {
          console.error('vote for nonexisting candidate!', candidateId);
        }
      });
    }
  });
  return votes;
}

export function fetchVotes({ candidatesUrl, reportUrl }) {
  return fetch(candidatesUrl).then((res) => res.json()).then((candidatesData) => {
    return fetch(reportUrl).then(function(res) {
      return res.text();
    }).then(function(body) {
      return parseVotes(body, candidatesData);
    });
  });
}
