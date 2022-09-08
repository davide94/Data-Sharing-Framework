pragma solidity >=0.7.0 <0.9.0;

/**
 * @title SC
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract SC {

    mapping(bytes32 => bytes32) decisions;
    mapping(bytes32 => bytes32) logs;

    /**
     * @dev Store CID of a decision from XAC
     * @param request_id id of the request
     * @param cid value to store
     */
    function storeDecision(bytes32 request_id, bytes32 cid) public {
        // TODO: Check sender

        decisions[request_id] = cid;
    }

    /**
     * @dev Store CID of a folder containing logs generated from DAM
     * @param request_id id of the request
     * @param cid value to store
     */
    function storeDecision(bytes32 request_id, bytes32 cid) public {
        // TODO: Check sender

        logs[request_id] = cid;
    }

    /**
     *
     */
    function retrieve(bytes32 request_id) public view returns (bytes32, bytes32) {
        // TODO: Check sender

        return (decisions[request_id], logs[request_id]);
    }
}