import * as joi from 'joi';

export const SMEvalidationObject = joi.object({
  user_id: joi.any().optional(),
  email: joi.string().email().optional(),
  phone: joi.string().optional(),
  agent_id: joi.any().optional(),
  business_name: joi.string().required(),
  business_address: joi.string().required(),
  RC_number: joi.string().required(),
  TIN_number: joi.string().required(),
  business_up_time: joi.string().required(),
  purpose_of_loan: joi.string().required(),
  type: joi.number().required(),
  draft: joi.bool().required(),
});
