import { renewInvitationCode } from './invitation.service';
import * as api from './api';

jest.mock('./api');

describe('renewInvitationCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ruft apiFetch mit korrekten Parametern auf und gibt den neuen Code zurück', async () => {
    (api.apiFetch as jest.Mock).mockResolvedValue('NEW-CODE-123');

    const result = await renewInvitationCode();

    expect(result).toBe('NEW-CODE-123');
    expect(api.apiFetch).toHaveBeenCalledWith('/invitations/renew', { method: 'PATCH' });
  });

  it('leitet API-Fehler weiter', async () => {
    (api.apiFetch as jest.Mock).mockRejectedValue(new Error('Netzwerkfehler'));

    await expect(renewInvitationCode()).rejects.toThrow('Netzwerkfehler');
  });
});
