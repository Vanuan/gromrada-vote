function parseVotes(body, data) {
  var votes = {};
  var candidates = data.candidates;
  candidates.forEach((candidate) => { votes[candidate.id] = { votes: 0, info: candidate }; });
  var voters = body.split('\n').filter((voter) => voter.trim());
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
  return {
    votersCount: voters.length,
    candidatesCount: Object.keys(candidates).length,
    votes
  };
}

export function calcVotes({ publicReport, candidates }) {
  return parseVotes(publicReport, candidates);
}
