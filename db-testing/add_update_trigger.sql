CREATE TRIGGER update_invitees_updated_at
AFTER UPDATE ON Invitees
FOR EACH ROW
BEGIN
    UPDATE Invitees
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;